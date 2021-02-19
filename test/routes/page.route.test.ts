import {TestFactory} from "../testFactory";
import {page} from "../test.data";
import {cleanDb, cleanPages} from "../test.helper";
import {Page} from "../../src/models/database/page.model";
import {PageWeb} from "../../src/models/web/page.web.model";

const factory: TestFactory = new TestFactory();

/**
 * Tests the page route.
 */
describe("page.route.ts '/api/page'", () => {

    /**
     * Syncs the database and server before all tests.
     */
    before(async () => {
        await factory.init(true);
    });

    /**
     * Closes database and server after all tests.
     */
    after(async () => {
        await factory.close();
    });

    /**
     * Checks if retrieving all pages works.
     */
    describe("Retrieving all pages", () => {
        it("Returns error without proper permissions", (done) => {
            factory.agents.nobodyUserAgent.get("/api/page/")
                .expect(403).then(function(_: any): any {
                done();
            }).catch(function(_: any): any {
                done(new Error());
            });
        });

        it("Returns all pages", (done) => {
            factory.agents.superAdminAgent.get("/api/page/").expect(200).then(function(res: any): any {
                if (res.body[0].url === "super cool url") {
                    done();
                } else {
                    done(new Error());
                }
            }).catch(function(_: any): any {
                done(new Error());
            });
        });
    });
});
