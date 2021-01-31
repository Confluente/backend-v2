import { expect } from "chai";
import {TestFactory} from "../../testFactory";
import {Role} from "../../../src/models/database/role.model";
import {organizingGroup, publishedActivityWithSubscriptionForm, role, user} from "../../test.data";
import {User} from "../../../src/models/database/user.model";
import {UserWeb} from "../../../src/models/web/user.web.model";
import {Group} from "../../../src/models/database/group.model";
import {Activity} from "../../../src/models/database/activity.model";

const factory: TestFactory = new TestFactory();

describe("user.web.model.ts", () => {

    /**
     * Syncs the database and server before all tests.
     */
    before(async () => {
        await factory.init();
        await Role.create(role);
        const dbGroup = await Group.create(organizingGroup);
        const dbAct = await Activity.create(publishedActivityWithSubscriptionForm);
        await dbGroup.$add('activities', dbAct);
        const dbUser = await User.create(user);
        await dbGroup.$add('members', dbUser, {through: {func: "Member"}});
        await dbUser.$add('activities', dbAct, {through: {answers: ["Super Administrator#,#superadmin#,#Kapowowowskies#,#woof"]}});
    });

    /**
     * Closes database and server after all tests.
     */
    after(async () => {
        await factory.close();
    });

    describe("getWebModelFromDbModel", () => {

        it("basic case", (done) => {
            User.findOne({where: {displayName: user.displayName}}).then(function(dbUser: User): void {
                const webUser = UserWeb.getWebModelFromDbModel(dbUser);

                let correct = true;
                if (webUser.id !== dbUser.id) { correct = false; }

                if (correct) {
                    done();
                } else {
                    done(new Error());
                }
            });
        });

        it("Checks exception", () => {
            Role.findOne({where: {name: role.name}}).then(function(dbRole: Role): void {
                expect(() => {
                    UserWeb.getWebModelFromDbModel(dbRole);
                }).to.throw("user.web.model.getWebModelFromDbModel: dbUser was not a User instance");
            });
        });
    });
});
