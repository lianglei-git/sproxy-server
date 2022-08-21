"use strict";
exports.__esModule = true;
var vitest_1 = require("vitest");
var _require_1 = require("../source/_require");
var lock_1require_1 = require("./lock_1require");
vitest_1.test("for my require test", function () {
    vitest_1.it("only one js", function () {
        vitest_1.expect(_require_1["default"]('./lock_1require')).toEqual(lock_1require_1["default"]);
    });
    vitest_1.it("To other references", function () {
        // TODO
    });
});
