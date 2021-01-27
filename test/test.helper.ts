import {Model} from "sequelize-typescript";
import {Activity} from "../src/models/database/activity.model";
import {CompanyOpportunity} from "../src/models/database/company.opportunity.model";
import {Group} from "../src/models/database/group.model";
import {Page} from "../src/models/database/page.model";
import {Role} from "../src/models/database/role.model";
import {Subscription} from "../src/models/database/subscription.model";
import {User} from "../src/models/database/user.model";
import {UserGroup} from "../src/models/database/usergroup.model";

export async function cleanActivities(): Promise<void> {
    Activity.destroy({truncate: true});
}

export function cleanCompanyOpportunities(): void {
    CompanyOpportunity.destroy({truncate: true});
}

export function cleanGroups(): void {
    Group.destroy({truncate: true});
}

export function cleanPages(): void {
    Page.destroy({truncate: true});
}

export function cleanRoles(): void {
    Role.destroy({truncate: true});
}

export function cleanSubscriptions(): void {
    Subscription.destroy({truncate: true});
}

export function cleanUsers(): void {
    User.destroy({truncate: true});
}

export function cleanUsergroups(): void {
    UserGroup.destroy({truncate: true});
}

export function clean<B extends Model>(modelClass: B): void {
    modelClass.destroy();
}
