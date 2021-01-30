import {TestFactory} from "../../testFactory";
import {page, role} from "../../test.data";
import {Page} from "../../../src/models/database/page.model";
import {PageWeb} from "../../../src/models/web/page.web.model";
import {Role} from "../../../src/models/database/role.model";
import { expect } from "chai";

const factory: TestFactory = new TestFactory();

describe("page.web.model.ts", () => {

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
            Page.create(page).then(function(dbPage: Page): void {
                const webPage = PageWeb.getWebModelFromDbModel(dbPage);

                let correct = true;
                if (webPage.url !== dbPage.url) { correct = false; }
                if (webPage.title !== dbPage.title) { correct = false; }
                if (webPage.content !== dbPage.content) { correct = false; }
                if (webPage.author !== dbPage.author) { correct = false; }
                if (webPage.htmlContent === undefined) { correct = false; }

                if (correct) {
                    done();
                } else {
                    done(new Error());
                }
            });
        });

        it("checks exception", () => {
            Role.create(role).then(function(dbRole: Role): void {
                expect(() => {
                    PageWeb.getWebModelFromDbModel(dbRole);
                }).to.throw("page.web.model.getWebModelFromDbModel: dbPage wwas not a Page instance");
            });
        });
    });
});
