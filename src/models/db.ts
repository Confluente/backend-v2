import {Sequelize} from 'sequelize-typescript';
import {Activity} from "./activity.model";
import {CompanyOpportunity} from "./company.opportunity.model";
import {Group} from "./group.model";
import {Page} from "./page.model";
import {Role} from "./role.model";
import {Session} from "./session.model";
import {Subscription} from "./subscription.model";
import {User} from "./user.model";
import {UserGroup} from "./usergroup.model";

const storage = (process.env.NODE_ENV === "test") ? ":memory:" : "data.sqlite";
export const db: Sequelize = new Sequelize({
    database: "db",
    dialect: "sqlite",
    username: null,
    password: null,
    storage,
});

db.addModels([Activity, CompanyOpportunity, Group, Page, Role, Session, Subscription, User, UserGroup]);

