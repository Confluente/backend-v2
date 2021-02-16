import {TestFactory} from "../testFactory";
import {page} from "../test.data";
import {cleanPages} from "../test.helper";
import {Page} from "../../src/models/database/page.model";
import {roleNotLoggedIn} from "../test.data";
import {cleanRoles} from "../test.helper";
import {Role} from "../../src/models/database/role.model";

const factory: TestFactory = new TestFactory();

/**
 * Tests the page route.
 */
describe("page.route.ts", () => {

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

    /**
     * Checks if retrieving all pages works.
     */
    describe("Retrieving all pages", () => {
        it("Returns error without proper permissions", async (done) => {
            Role.create(roleNotLoggedIn);

            const res = await factory.app.get("/page/");
            done();
        });
    });
});
