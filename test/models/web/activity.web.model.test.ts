import {TestFactory} from "../../testFactory";
import {Role} from "../../../src/models/database/role.model";
import {organizingGroup, publishedActivityWithSubscriptionForm, role, superAdmin} from "../../test.data";
import {User} from "../../../src/models/database/user.model";
import {cleanDb} from "../../test.helper";
import {ActivityWeb} from "../../../src/models/web/activity.web.model";
import {Group} from "../../../src/models/database/group.model";
import {Activity} from "../../../src/models/database/activity.model";
import {resolve} from "q";

const factory: TestFactory = new TestFactory();

describe("activity.web.model.ts", () => {

    /**
     * Syncs the database and server before all tests.
     */
    before(async () => {
        await factory.init();
        const dbRole = await Role.create(role);
    });

    /**
     * Closes database and server after all tests.
     */
    after(async () => {
        await cleanDb();
        await factory.close();
    });

    describe("getWebModelFromDbModel", () => {

        it("basic case", async () => {
            const dbGroup = await Group.create(organizingGroup);
            let dbAct = await Activity.create(publishedActivityWithSubscriptionForm);
            await dbGroup.$add('activities', dbAct);
            const dbUser = await User.create(superAdmin);
            await dbGroup.$add('members', dbUser, {through: {func: "Member"}});
            await dbUser.$add('activities', dbAct, {through: {answers: "Super Administrator#,#superadmin#,#Kapowowowskies#,#woof"}});

            dbAct = await Activity.findByPk(dbAct.id, {include: [User]});

            ActivityWeb.getWebModelFromDbModel(dbAct).then(function(webAct: ActivityWeb): void {
                if ((webAct.id !== dbAct.id) ||
                        (webAct.startTime !== "01:00") ||
                        (webAct.typeOfQuestion[0].toString() !== "name") ||
                        (webAct.required[0] !== true) ||
                        (webAct.formOptions[0][0] !== "lk") ||
                        (webAct.participants[0].user.email !== "superadmin") ||
                        (webAct.participants[0].activity.startTime !== "01:00") ||
                        (webAct.organizer.displayName !== "OG"))
                {
                    resolve(new Error());
                }

                resolve();
            }).catch(function(err: Error): void {
                resolve(new Error());
            });
        });

        it("checks exception", (done) => {
            Role.findByPk(1).then(function(dbRole: Role): void {
                ActivityWeb.getWebModelFromDbModel(dbRole).then(function(aw: ActivityWeb): void {
                    done(new Error());
                }).catch(function(err: Error): void {
                    if (err.message === "activity.web.model.getWebModelFromDbModel: dbActivity was not an Activity " +
                        "instance") {
                        done();
                    } else {
                        done(new Error());
                    }
                });
            });
        });
    });
});
