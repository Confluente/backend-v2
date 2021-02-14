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
import supertest, {SuperAgentTest} from "supertest";
import {setupServer} from "../src/expressServer";
import {resolve} from "q";
import {initTestData} from "./test.data";

export class TestFactory {
    private _app: Express;
    private _connection: any;
    private _server: HttpServer;
    public agents: {
        activeMemberAgent: SuperAgentTest;
    };

    // DB testDb
    private db: Sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        username: null,
        password: null,
        models: [Activity, CompanyOpportunity, Group, Page, Role, Session, Subscription, User, UserGroup],
        // logging: false,
    });

    public get app(): supertest.SuperTest<supertest.Test> {
        return supertest(this._app);
    }

    public get server(): HttpServer {
        return this._server;
    }

    public async init(inTestData: boolean = false): Promise<void> {
        this._app = express();
        this._connection = await this.db.sync({force: true});
        setupServer(this._app);
        this._server = createServer(this._app).listen("80");

        if (inTestData) {
            const agents = await initTestData(this._app);
            this.agents = agents;
        }
    }

    public async close(): Promise<void> {
        this._server.close();
    }
}
