import { expect } from "chai";
import {TestFactory} from "../../testFactory";
import {Role} from "../../../src/models/database/role.model";
import {page, role} from "../../test.data";
import {RoleWeb} from "../../../src/models/web/role.web.mode";
import {Page} from "../../../src/models/database/page.model";
import exp = require("constants");

const factory: TestFactory = new TestFactory();

describe("role.web.model.ts", () => {

    /**
     * Syncs the database and server before all tests.
     */
    before(async () => {
        await factory.init();
    });

    /**
     * Closes database and server after all tests.
     */
    after(async () => {
        await factory.close();
    });

    describe("getWebModelFromDbModel", () => {

        it("Checks basic case", (done) => {
            Role.create(role).then(function(dbRole: Role): void {
                const webRole = RoleWeb.getWebModelFromDbModel(dbRole);

                let correct = true;
                if (webRole.name !== dbRole.name) { correct = false; }
                if (webRole.ACTIVITY_VIEW_ALL_UNPUBLISHED !== dbRole.ACTIVITY_VIEW_ALL_UNPUBLISHED) { correct = false; }
                if (webRole.GROUP_MANAGE !== webRole.GROUP_MANAGE) { correct = false; }

                if (correct) {
                    done();
                } else {
                    done(new Error());
                }
            });
        });

        it("Checks exception", () => {
            Page.create(page).then(function(dbPage: Page): void {
                expect(() => {
                    RoleWeb.getWebModelFromDbModel(dbPage);
                }).to.throw("role.web.model.getWebModelFromDbModel: dbRole was not a Role instance");
            });
        });
    });
});
