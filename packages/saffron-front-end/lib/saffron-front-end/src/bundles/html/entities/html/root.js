"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const group_1 = require('./group');
const index_1 = require('saffron-common/src/fragments/index');
const fragment_1 = require('saffron-common/src/section/fragment');
class RootEntity extends group_1.default {
    constructor(properties) {
        super(properties);
        this.section = new fragment_1.default();
    }
    load(options) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            yield _super("load").call(this, {
                options,
                section: this.section
            });
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RootEntity;
exports.fragment = new index_1.ClassFactoryFragment('entities/root', group_1.default);
//# sourceMappingURL=root.js.map