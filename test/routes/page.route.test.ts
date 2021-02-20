import {TestFactory} from "../testFactory";
import {page, newPage} from "../test.data";

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
                .expect(403).then(function(_: any): any {
                done();
            }).catch(function(_: any): any {
                done(new Error());
            });
        });

        it("Returns error when page does not exist", (done) => {
           factory.agents.superAdminAgent.get("/api/page/thispagedefinitelydoesnotexist")
               .expect(404).then(function(_: any): any {
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

        it("Correctly create new page", (done) => {
           factory.agents.superAdminAgent.put("/api/page/" + newPage.url).send(newPage)
               .expect(201).then(function(_: any): any {
              factory.agents.superAdminAgent.get("/api/page/" + newPage.url).then(function(res: any): any {
                  if (res.body.author === newPage.author) {
                      done();
                  } else {
                      done(new Error());
                  }
              }).catch(function(error: any): any {
                  done(new Error());
              });
           }).catch(function(_: any): any {
               done(new Error());
           });
        });

        it("Correctly edit existing page", (done) => {
            const editedPage = newPage;
            editedPage.content = "CHANGED CONTENT";

            factory.agents.superAdminAgent.put("/api/page/" + newPage.url).send(editedPage)
                .expect(201).then(function(_: any): any {
                factory.agents.superAdminAgent.get("/api/page/" + newPage.url).then(function(res: any): any {
                    if (res.body.author === newPage.author && res.body.content === "CHANGED CONTENT") {
                        done();
                    } else {
                        done(new Error());
                    }
                }).catch(function(error: any): any {
                    done(new Error());
                });
            }).catch(function(_: any): any {
                done(new Error());
            });
        });
    });

    /**
     * Checks if deleting a page works.
     */
    describe("Deleting a page", () => {
        it("Returns error without proper permissions", (done) => {
            factory.agents.zeroPermissionsAgent.delete("/api/page/" + newPage.url)
                .expect(403).then(function(_: any): any {
                done();
            }).catch(function(_: any): any {
                done(new Error());
            });
        });

        it("Deletes correct page", (done) => {
            factory.agents.superAdminAgent.delete("/api/page/" + newPage.url)
                .expect(204).then(function(_: any): any {
                factory.agents.superAdminAgent.get("/api/page/" + newPage.url)
                    .expect(404).then(function(res: any): any {
                    done();
                }).catch(function(error: any): any {
                    done(new Error());
                });
            }).catch(function(_: any): any {
                done(new Error());
            });
        });
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
