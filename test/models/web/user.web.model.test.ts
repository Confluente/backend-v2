import {TestFactory} from "../../testFactory";
import {Role} from "../../../src/models/database/role.model";
import {organizingGroup, publishedActivityWithSubscriptionForm, roleSuperAdmin, superAdmin} from "../../test.data";
import {User} from "../../../src/models/database/user.model";
import {UserWeb} from "../../../src/models/web/user.web.model";
import {Group} from "../../../src/models/database/group.model";
import {Activity} from "../../../src/models/database/activity.model";
import {cleanDb} from "../../test.helper";
import {resolve} from "q";

const factory: TestFactory = new TestFactory();

describe("user.web.model.ts", () => {

    describe("getWebModelFromDbModel", () => {

        /**
         * Syncs the database and server before all tests.
         */
        before(async () => {
            await factory.init();
        });

        beforeEach(async () => {
            await Role.create(roleSuperAdmin);
        });

        afterEach(async () => {
            await cleanDb();
        });

        /**
         * Closes database and server after all tests.
         */
        after(async () => {
            await factory.close();
        });

        it("basic case", async () => {
            const dbGroup = await Group.create(organizingGroup);
            const dbAct = await Activity.create(publishedActivityWithSubscriptionForm);
            await dbGroup.$add('activities', dbAct);
            let dbUser = await User.create(superAdmin);
            await dbGroup.$add('members', dbUser, {through: {func: "Member"}});
            await dbUser.$add('activities', dbAct, {through: {answers: "Super Administrator#,#superadmin#,#Kapowowowskies#,#woof"}});

            dbUser = await User.findByPk(dbUser.roleId, {include: [Group, Activity]});

            UserWeb.getWebModelFromDbModel(dbUser).then(function(webUser: UserWeb): void {
                let correct = true;
                if (webUser.id !== dbUser.id) { correct = false; }
                if (webUser.email !== dbUser.email) { correct = false; }
                if (webUser.groups[0].group.fullName !== dbGroup.fullName) { correct = false; }
                if (webUser.groups[0].func !== "Member") { correct = false; }
                if (webUser.role.name !== roleSuperAdmin.name) { correct = false; }

                if (correct) {
                    resolve();
                } else {
                    resolve(new Error());
                }
            }).catch(function(err: Error): void {
                resolve(new Error());
            });
        });

        it("Checks exception", (done) => {
            Role.findByPk(1).then(function(dbRole: Role): void {

                UserWeb.getWebModelFromDbModel(dbRole).then(function(uw: UserWeb): void {
                    done(new Error());
                }).catch(function(err: Error): void {
                    if (err.message === "user.web.model.getWebModelFromDbModel: dbUser was not a User instance") {
                        done();
                    } else {
                        done(new Error());
                    }
                });
            });
        });
    });
});
