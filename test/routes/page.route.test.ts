import {TestFactory} from "../testFactory";
import {page} from "../test.data";

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
     * Checks if retrieving a specific page works.
     */
    describe("Get a specific page", () => {
        it("Returns error without proper permissions", (done) => {
            factory.agents.zeroPermissionsAgent.get("/api/page/" + page.url)
                .expect(200).then(function(_: any): any {
                done();
            }).catch(function(_: any): any {
                done(new Error());
            });
        });

        it("Returns correct page", (done) => {
            factory.agents.superAdminAgent.get("/api/page/" + page.url)
                .expect(200).then(function(res: any): any {
                    if (res.body.title === page.title) {
                        done();
                    } else {
                        done(new Error());
                    }
            }).catch(function(_: any): any {
                done(new Error());
            });
        });
    });

    /**
     * Checks if editing a page works.
     */
    describe("Editing a page", () => {
        it("Returns error without proper permissions", (done) => {
            factory.agents.zeroPermissionsAgent.put("/api/page/newurl").expect(403).then(function(_: any): any {
                done();
            }).catch(function(_: any): any {
                done(new Error());
            });
        });

        // it("Correctly create new page", (done) => {
        //    factory.agents.superAdminAgent.put("/api/page" + page.url)
        // });
    });

    /**
     * Checks if retrieving all pages works.
     */
    describe("Retrieving all pages", () => {
        it("Returns error without proper permissions", (done) => {
            factory.agents.zeroPermissionsAgent.get("/api/page/")
                .expect(403).then(function(_: any): any {
                done();
            }).catch(function(_: any): any {
                done(new Error());
            });
        });

        it("Returns all pages", (done) => {
            factory.agents.superAdminAgent.get("/api/page/").expect(200).then(function(res: any): any {
                if (res.body[0].url === page.url) {
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
