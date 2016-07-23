"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const index_ts_1 = require("./index.ts");
const actions_1 = require("saffron-core/src/actions");
const chai_1 = require("chai");
describe(__filename + "#", () => {
    it("can be created", () => {
        new index_ts_1.Application();
    });
    it("initializes a load, then initialize action", () => __awaiter(this, void 0, void 0, function* () {
        let i = 0;
        const app = new index_ts_1.Application({});
        app.actors.push({
            execute(action) {
                if (action.type === actions_1.LOAD)
                    chai_1.expect(i++).to.equal(0);
                if (action.type === actions_1.INITIALIZE)
                    chai_1.expect(i++).to.equal(1);
            }
        });
        yield app.initialize();
        chai_1.expect(i).to.equal(2);
    }));
    it("can bind to the loading property", () => __awaiter(this, void 0, void 0, function* () {
        const app = new index_ts_1.Application({});
    }));
});
//# sourceMappingURL=index-test.js.map