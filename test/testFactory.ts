import express, {Express} from "express";
import {createServer, Server as HttpServer} from "http";
import {Sequelize} from "sequelize-typescript";
import {Activity} from "../src/models/database/activity.model";
import {CompanyOpportunity} from "../src/models/database/company.opportunity.model";
import {Group} from "../src/models/database/group.model";
import {Page} from "../src/models/database/page.model";
import {Role} from "../src/models/database/role.model";
import {Subscription} from "../src/models/database/subscription.model";
import {User} from "../src/models/database/user.model";
import {UserGroup} from "../src/models/database/usergroup.model";
import {Session} from "../src/models/database/session.model";
import {SuperAgentTest} from "supertest";
import {setupServer} from "../src/expressServer";
import {initTestData} from "./test.data";
import {cleanDb} from "./test.helper";

export class TestFactory {
    private _app: Express;
    private _connection: any;
    private _server: HttpServer;
    public agents: {
        superAdminAgent: SuperAgentTest;
        adminAgent: SuperAgentTest;
        boardMemberAgent: SuperAgentTest;
        activeMemberAgent: SuperAgentTest;
        nonActiveMemberAgent: SuperAgentTest;
        nobodyUserAgent: SuperAgentTest;
    };

    // DB testDb
    private db: Sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        username: null,
        password: null,
        models: [Activity, CompanyOpportunity, Group, Page, Role, Session, Subscription, User, UserGroup],
        logging: false,
    });

    public get app(): Express {
        return this._app;
    }

    public get server(): HttpServer {
        return this._server;
    }

    public async init(inTestData: boolean = false): Promise<void> {
        this._app = express();
        this._connection = await this.db.sync({force: true});
        await setupServer(this.app);
        this._server = createServer(this.app).listen("3000");

        if (inTestData) {
            this.agents = await initTestData(this.app);
        }
    }

    public async close(): Promise<void> {
        await cleanDb();
        this._server.close();
    }
}
