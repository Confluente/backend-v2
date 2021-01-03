import {Sequelize} from 'sequelize-typescript';


import {Activity} from "./models/database/activity.model";
import {CompanyOpportunity} from "./models/database/company.opportunity.model";
import {Group} from "./models/database/group.model";
import {Page} from "./models/database/page.model";
import {Role} from "./models/database/role.model";
import {Session} from "./models/database/session.model";
import {Subscription} from "./models/database/subscription.model";
import {User} from "./models/database/user.model";
import {UserGroup} from "./models/database/usergroup.model";

const storage = (process.env.NODE_ENV === "test") ? ":memory:" : "data.sqlite";
export const db: Sequelize = new Sequelize({
    database: "db",
    dialect: "sqlite",
    username: null,
    password: null,
    storage: ":memory:",
    models: [Activity, CompanyOpportunity, Group, Page, Role, Session, Subscription, User, UserGroup],
});

// db.addModels([Activity, CompanyOpportunity, Group, Page, Role, Session, Subscription, User, UserGroup]);
