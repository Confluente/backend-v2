import {Model} from "sequelize-typescript";
import {Activity} from "../src/models/database/activity.model";
import {CompanyOpportunity} from "../src/models/database/company.opportunity.model";
import {Group} from "../src/models/database/group.model";
import {Page} from "../src/models/database/page.model";
import {Role} from "../src/models/database/role.model";
import {Subscription} from "../src/models/database/subscription.model";
import {User} from "../src/models/database/user.model";
import {UserGroup} from "../src/models/database/usergroup.model";
import {Session} from "../src/models/database/session.model";
import * as supertest from "supertest";

export async function cleanActivities(): Promise<void> {
    await Activity.destroy({truncate: true});
}

export async function cleanCompanyOpportunities(): Promise<void> {
    await CompanyOpportunity.destroy({truncate: true});
}

export async function cleanGroups(): Promise<void> {
    await Group.destroy({truncate: true});
}

export async function cleanPages(): Promise<void> {
    await Page.destroy({truncate: true});
}

export async function cleanRoles(): Promise<void> {
    await Role.destroy({where: {}});
}

export async function cleanSubscriptions(): Promise<void> {
    await Subscription.destroy({truncate: true});
}

export async function cleanUsers(): Promise<void> {
    await User.destroy({truncate: true});
}

export async function cleanUsergroups(): Promise<void> {
    await UserGroup.destroy({truncate: true});
}

export async function cleanSessions(): Promise<void> {
    await Session.destroy({truncate: true});
}

export async function cleanDb(): Promise<void> {
    await cleanSubscriptions();
    await cleanCompanyOpportunities();
    await cleanSessions();
    await cleanUsergroups();
    await cleanActivities();
    await cleanGroups();
    await cleanPages();
    await cleanUsers();
    await cleanRoles();
}

export async function authenticate(agent: any, credentials: any): Promise<any> {
    return agent.post("/api/auth/login").send(credentials).expect(200)
        .catch(function(res: any): void {
            console.log("Logging in went wrong!");
            console.log(res);
        });
}
