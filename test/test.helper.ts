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
    await cleanActivities();
    await cleanCompanyOpportunities();
    await cleanGroups();
    await cleanPages();
    await cleanRoles();
    await cleanSubscriptions();
    await cleanUsers();
    await cleanUsergroups();
    await cleanSessions();
}
