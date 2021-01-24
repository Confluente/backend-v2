import {db} from "../src/db";
import assert = require("assert");
import {Role} from "../src/models/database/role.model";
import {roles} from "../src/import_initial";

(async () => {
    assert(process.env.NODE_ENV === "test");

    await db.sync();

    await Role.bulkCreate(roles).then(function(result: Role[]): void {
        console.log("Roles created");
    });
})();
