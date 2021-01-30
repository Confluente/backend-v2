import {TestFactory} from "../../testFactory";
import {Role} from "../../../src/models/database/role.model";
import {organizingGroup, role, user} from "../../test.data";
import {User} from "../../../src/models/database/user.model";
import {Group} from "../../../src/models/database/group.model";
import {where} from "sequelize";
import {GroupWeb} from "../../../src/models/web/group.web.model";

const factory: TestFactory = new TestFactory();

describe("group.web.model.ts", () => {

    /**
     * Syncs the database and server before all tests.
     */
    before(async () => {
        await factory.init();
        await Role.create(role);
        await User.create(user);
    });

    /**
     * Closes database and server after all tests.
     */
    after(async () => {
        await factory.close();
    });

    describe("getWebModelFromDbModel", () => {

        it("basic case", (done) => {
            User.findOne({where: {email: user.email}}).then(function(dbUser: User): void {
                Group.create(organizingGroup).then(function(dbGr: Group): void {
                    dbGr.$add('members', dbUser, {through: {func: "Chair"}})
                            .then(function(_: any): void {
                        Group.findByPk(dbGr.id, {attributes: ["id", "description"], include: [User]})
                                .then(function(updatedGroup: Group): void {
                            const webGroup = GroupWeb.getWebModelFromDbModel(updatedGroup);

                            let correct = true;
                            if (webGroup.members[0].user.id !== dbUser.id) { correct = false; }
                            if (webGroup.members[0].func !== "Chair") { correct = false; }
                            if (webGroup.description !== organizingGroup.description) { correct = false; }
                            if (webGroup.members.length !== 1) { correct = false; }

                            if (correct) {
                                done();
                            } else {
                                done(new Error());
                            }
                        });
                    });
                });
            });
        });
    });
});
