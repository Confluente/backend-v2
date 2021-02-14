import {TestFactory} from "../testFactory";
import {cleanDb} from "../test.helper";

const factory: TestFactory = new TestFactory();

describe("auth.ts", () => {

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
        await cleanDb();
        await factory.close();
    });

    it("test if init works", () => {
        factory.agents.activeMemberAgent.get("/api/auth")
            .expect(200)
            .then(function(res: any): any {
                console.log(res);
            });
        // activeMemberAgent
        //     .get("/api/auth")
        //     .expect(200)
        //     .then(function(res: any): any {
        //         console.log(res);
        //     });
    });
});
