import {TestFactory} from "../../testFactory";
import {page, role} from "../../test.data";
import {Page} from "../../../src/models/database/page.model";
import {PageWeb} from "../../../src/models/web/page.web.model";
import {Role} from "../../../src/models/database/role.model";
import { expect } from "chai";
import {cleanPages, cleanRoles} from "../../test.helper";

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
                PageWeb.getWebModelFromDbModel(dbPage).then(function(webPage: PageWeb): void {
                    cleanPages();

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
        });

        it("checks exception", (done) => {
            Role.create(role).then(function(dbRole: Role): void {
                cleanRoles();

                PageWeb.getWebModelFromDbModel(dbRole).then(function(pw: PageWeb): void {
                    done(new Error());
                }).catch(function(err: Error): void {
                    if (err.message === "page.web.model.getWebModelFromDbModel: dbPage was not a Page instance") {
                        done();
                    } else {
                        done(new Error());
                    }
                });
            });
        });
    });
});
