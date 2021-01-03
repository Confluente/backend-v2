import {Sequelize} from 'sequelize-typescript';

const storage = (process.env.NODE_ENV === "test") ? ":memory:" : "data.sqlite";
export const db: Sequelize = new Sequelize({
    database: "db",
    dialect: "sqlite",
    username: null,
    password: null,
    storage,
});

import {Activity} from "./models/activity.model";
import {CompanyOpportunity} from "./models/company.opportunity.model";
import {Group} from "./models/group.model";
import {Page} from "./models/page.model";
import {Role} from "./models/role.model";
import {Session} from "./models/session.model";
import {Subscription} from "./models/subscription.model";
import {User} from "./models/user.model";
import {UserGroup} from "./models/usergroup.model";

// db.addModels([Activity, CompanyOpportunity, Group, Page, Role, Session, Subscription, User, UserGroup]);
