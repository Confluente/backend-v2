import {TestFactory} from "../../testFactory";
import {Role} from "../../../src/models/database/role.model";
import {organizingGroup, role, user} from "../../test.data";
import {User} from "../../../src/models/database/user.model";
import {Group} from "../../../src/models/database/group.model";
import {GroupWeb} from "../../../src/models/web/group.web.model";
import { expect } from "chai";

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
            // Find the created user
            User.findOne({where: {email: user.email}}).then(function(dbUser: User): void {
                // Create a group for the member to be a part of
                Group.create(organizingGroup).then(function(dbGr: Group): void {
                    // Add the user to the group
                    dbGr.$add('members', dbUser, {through: {func: "Chair"}})
                            .then(function(_: any): void {
                        // Get updated group from db
                        Group.findByPk(dbGr.id, {attributes: ["id", "description"], include: [User]})
                                .then(function(updatedGroup: Group): void {
                            // Create web object
                            const webGroup = GroupWeb.getWebModelFromDbModel(updatedGroup);

                            // Check if web object is correct
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

        it("checks exception", () => {
            User.findOne({where: {email: user.email}}).then(function(dbUser: User): void {
                expect(() => {
                    GroupWeb.getWebModelFromDbModel(dbUser);
                }).to.throw("group.web.model.getWebModelFromDbModel: dbGroup was not a Group instance.");
            });
        });
    });
});
