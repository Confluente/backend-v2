import express, {Express, NextFunction, Request, Response} from "express";
import path from 'path';
import bodyParser, {json, urlencoded} from "body-parser";
import cookieParser from 'cookie-parser';
import {scheduleJob} from 'node-schedule';
import {Op} from "sequelize";
import {createTestAccount, createTransport} from 'nodemailer';
import {logger} from "./logger";

import {checkPermission} from "./permissions";

// Import db models
import {User} from "./models/database/user.model";
import {Session} from "./models/database/session.model";

let webroot: any;

export const app: Express = express();

export async function setupServer(server: Express): Promise<void> {

    // Set webroot dependent on whether running for tests, development, or production
    if (process.env.NODE_ENV === "test") {
        webroot = path.resolve(__dirname, "www");
    } else if (process.env.NODE_ENV === "development") {
        console.log("Running in DEVELOPMENT mode!");

        server.use((req: any, res: any, next: () => void) => {
            logger.info(req.url, "express_request");
            next();
        });
    } else { // Running in production
        console.log("Running in PRODUCTION mode!");
        webroot = path.resolve(__dirname, "../dist/frontend/");

        server.use((req: any, res: any, next: () => void) => {
            logger.info(req.url, "express_request");
            next();
        });
    }

    server.use(bodyParser.json({limit: '10mb'}));

    server.use((req: any, res: any, next: any) => {
        // update to match the domain you will make the request from
        res.header("Access-Control-Allow-Origin", "http://localhost");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, serverend, delete, entries, foreach, get, has, keys, set, values, Authorization");
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
        next();
    });

    server.options('*', (req: any, res: any) => {
        res.setHeader("Access-Control-Allow-Origin", "http://localhost");
        res.setHeader('Access-Control-Allow-Methods', "GET, POST, OPTIONS, PUT, DELETE");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        res.end();
    });

    server.use(json({limit: '10mb'}));
    server.use(urlencoded({limit: '10mb', extended: false}));
    server.use(cookieParser());
    server.use((req: any, res: any, next: any) => {
        if (req.cookies.session) {
            const token: any = Buffer.from(req.cookies.session, "base64");
            Session.findOne({where: {token}}).then((session: any) => {
                if (session) {
                    res.locals.session = session.dataValues;
                } else {
                    res.clearCookie("session");
                }
                next();
            });
        } else {
            next();
        }
    });

    // HTTPS Rerouting (only for production website version)
    if (process.env.NODE_ENV === "production") {
        server.use((req: Request, res: Response, next: NextFunction) => {
            if (req.secure) {
                // request was via https, so do no special handling
                next();
            } else {
                // acme challenge is used for certificate verification for HTTPS
                if (req.url === "/.well-known/acme-challenge/w34RbDaItodmnSs5NWc0oWTeAFIfTLI_jKTbm6X9RJw") {
                    res.redirect('http://hsaconfluente.nl/assets/documents/acme');
                }

                if (req.url === "/.well-known/acme-challenge/AwBsh5cJauTSfFSqJpBQH0dQtJydFhh-C6GQWQdR46E") {
                    res.redirect('http://hsaconfluente.nl/assets/documents/acme2');
                }

                res.redirect('https://' + req.headers.host + req.url);
                // request was via http, so redirect to https
            }
        });
    }

    server.use("/api/auth", require("./routes/auth.route"));
    server.use("/api/activities", require("./routes/activity.route"));
    server.use("/api/groups", require("./routes/group.route"));
    server.use("/api/users", require("./routes/user.route"));
    server.use("/api/pages", require("./routes/page.route"));
    server.use("/api/roles", require("./routes/role.route"));
    server.use("/api/notifications", require("./routes/notification.route"));
    server.use("/api/partners", require("./routes/partner.route"));
    server.use("/api/*", (req: any, res: any) => {
        res.status(404).send({message: "Route not found"});
    });

    server.use((req: Request, res: Response, next: NextFunction) => {
        const user: any = res.locals.session ? res.locals.session.userId : null;
        checkPermission(user, {type: "PAGE_VIEW", value: +req.path})
            .then((hasPermission: any) => {
                if (!hasPermission) {
                    if (user) {
                        return res.status(403).send("User does not have the permission to view this page!");
                    } else {
                        return res.status(401).send("Page error");
                    }
                }
                return next();
            });
    });

    if (process.env.NODE_ENV === "production") {
        server.use(express.static(webroot));
    }

    server.get("*", (req: Request, res: Response) => {

        if (req.originalUrl.includes(".")) {
            return res.sendStatus(404);
        }

        res.sendFile("/index.html", {root: webroot});
    });

    server.use((err: Error) => {
        console.error(err);
    });

    // This sends an email to the secretary of H.S.A. Confluente every week if
    // new users have registered on the website

    // TODO this does not work anymore as the 'createdAt' column is no longer in the database

    // scheduleJob('0 0 0 * * 7', () => {
    //     const lastWeek: Date = new Date();
    //     lastWeek.setDate(lastWeek.getDate() - 7);
    //     User.findAll({
    //         attributes: ["firstName", "lastName", "email", "track"],
    //         where: {
    //             createdAt: {
    //                 [Op.gte]: lastWeek
    //             }
    //         }
    //     }).then((newUsers: any) => {
    //         if (newUsers.length) {
    //             // new users in the last 7 days so send an email to secretary
    //             const number_of_new_users: number = newUsers.length;
    //             let data_of_new_users: string = "";
    //             for (let i: number = 0; i < number_of_new_users; i++) {
    //                 data_of_new_users += "Name: " + newUsers[i].firstName + " " + newUsers[i].lastName;
    //                 data_of_new_users += ", Email: " + newUsers[i].email;
    //                 data_of_new_users += ", track: " + newUsers[i].track + "\n";
    //             }
    //
    //             createTestAccount().then(() => {
    //                 const transporter: any = createTransport({
    //                     service: 'gmail',
    //                     secure: true,
    //                     // Never fill this password in and add it to git! Only filled in locally or on the server!
    //                     auth: {
    //                         user: 'web@hsaconfluente.nl',
    //                         pass: ''
    //                     }
    //                 });
    //                 transporter.sendMail({
    //                     from: '"website" <web@hsaconfluente.nl>',
    //                     to: '"secretary of H.S.A. Confluente" <secretary@hsaconfluente.nl>',
    //                     subject: "New members that registered on the website",
    //                     text: "Heyhoi dear secretary \n \nIn the past week there have been "
    //                         + number_of_new_users.toString() + " new registrations on the website. "
    //                         + "\n\nThe names and emails of the new registrations are \n"
    //                         + data_of_new_users
    //                         + " \nSincerely, \nThe website \nOn behalf of the Web Committee"
    //                 }).then((info: object) => {
    //                     logger.info(info.toString());
    //                 });
    //             });
    //         }
    //     });
    // });
}
