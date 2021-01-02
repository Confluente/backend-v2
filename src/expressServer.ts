import express, {Request, Response} from "express";
import path from 'path';
import morgan from 'morgan';
import {json, urlencoded} from "body-parser";
import cookieParser from 'cookie-parser';
import {scheduleJob} from 'node-schedule';
import {Op} from "sequelize";
import {createTestAccount, createTransport} from 'nodemailer';
import {log} from "./logger";

const checkPermission: any = require("./permissions").check;

// Import db models
import {User} from "./models/user.model";
import {Session} from "./models/session.model";

process.env.NODE_ENV = "development";

let webroot: any;

export const app: any = express();

// Set webroot dependent on whether running for tests, development, or production
if (process.env.NODE_ENV === "test") {
    console.log("NODE_ENV=test");
    webroot = path.resolve(__dirname, "www");
} else if (process.env.NODE_ENV === "development") {
    console.log("Running in DEVELOPMENT mode!");
} else { // Running in production
    webroot = path.resolve(__dirname, "../frontend/build");
    app.use(morgan("combined", {stream: require("fs").createWriteStream("./access.log", {flags: "a"})}));

    app.use(function(req: any, res: any, next: () => void): void {
        log.info({req}, "express_request");
        next();
    });
}

// TODO check if the json thingy works
app.use(json({limit: '10mb'}));
app.use(urlencoded({limit: '10mb', extended: false}));
app.use(cookieParser());
app.use(function(req: any, res: any, next: any): void {
    if (req.cookies.session) {
        const token: any = Buffer.from(req.cookies.session, "base64");
        Session.findOne({where: {token}}).then(function(session: any): void {
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
    app.use(function(req: Request, res: Response, next: any): any {
        if (req.secure) {
            // request was via https, so do no special handling
            next();
        } else {
            // acme challenge is used for certificate verification for HTTPS
            if (req.url === "/.well-known/acme-challenge/nPHb2tBcwnLHnTBGzHTtjYZVgoucfI5mLLKrkU4JUFM") {
                res.redirect('http://hsaconfluente.nl/assets/documents/acme');
            }

            if (req.url === "/.well-known/acme-challenge/VSV0B332eYswinjUwESM_9jNY59Se17kCryEzUo28eE") {
                res.redirect('http://hsaconfluente.nl/assets/documents/acme2');
            }

            res.redirect('https://' + req.headers.host + req.url);
            // request was via http, so redirect to https
        }
    });
}


app.use(function(req: any, res: any, next: any): any {
    const user: any = res.locals.session ? res.locals.session.user : null;
    checkPermission(user, {type: "PAGE_VIEW", value: req.path})
        .then(function(hasPermission: any): any {
            if (!hasPermission) {
                if (user) {
                    return res.status(403).send();
                } else {
                    return res.status(401).send();
                }
            }
            return next();
        }).done();
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/activities", require("./routes/activities"));
app.use("/api/group", require("./routes/group"));
app.use("/api/user", require("./routes/user"));
app.use("/api/page", require("./routes/page"));
app.use("/api/notifications", require("./routes/notification"));
app.use("/api/*", function(req: any, res: any): void {
    res.sendStatus(404);
});

if (process.env.NODE_ENV === "production") {
    app.use(express.static(webroot));
}

app.get("*", function(req: any, res: any, next: any): any {

    if (req.originalUrl.includes(".")) {
        return res.sendStatus(404);
    }

    res.sendFile("/index.html", {root: webroot});
});

app.use(function(err: Error, req: any, res: any, next: any): void {
    console.error(err);
});

// This function sends an email to the secretary of H.S.A. Confluente every week if
// new users have registered on the website
const secretary_email: any = scheduleJob('0 0 0 * * 7', function(): void {
    const lastWeek: Date = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    User.findAll({
        attributes: ["displayName", "email", "track", "createdAt"],
        where: {
            createdAt: {
                [Op.gte]: lastWeek
            }
        }
    }).then(function(newUsers: any): void {
        if (newUsers.length) {
            // new users in the last 7 days so send an email to secretary
            const number_of_new_users: number = newUsers.length;
            let data_of_new_users: string = "";
            for (let i: number = 0; i < number_of_new_users; i++) {
                data_of_new_users += "Name: " + newUsers[i].displayName;
                data_of_new_users += ", Email: " + newUsers[i].email;
                data_of_new_users += ", track: " + newUsers[i].track + "\n";
            }

            createTestAccount().then(function(): void {
                // TODO check if this works
                const transporter: any = createTransport({
                    service: 'gmail',
                    secure: true,
                    // Never fill this password in and add it to git! Only filled in locally or on the server!
                    auth: {
                        user: 'web@hsaconfluente.nl',
                        pass: ''
                    }
                });
                transporter.sendMail({
                    from: '"website" <web@hsaconfluente.nl>',
                    to: '"secretary of H.S.A. Confluente" <treasurer@hsaconfluente.nl>',
                    subject: "New members that registered on the website",
                    // tslint:disable-next-line:max-line-length
                    text: "Heyhoi dear secretary \n \nIn the past week there have been " + number_of_new_users.toString() + " new registrations on the website. \n\nThe names and emails of the new registrations are \n" + data_of_new_users + " \nSincerely, \nThe website \nOn behalf of the Web Committee"
                }).then(function(info: object): void {
                    console.log(info);
                });
            });
        }
    });
});
