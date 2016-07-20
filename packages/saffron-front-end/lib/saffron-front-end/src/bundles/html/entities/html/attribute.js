"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const entity_1 = require('saffron-common/src/entities/entity');
const index_1 = require('saffron-common/src/fragments/index');
class AttributeEntity extends entity_1.default {
    load(options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.value = (yield this.expression.value.load(options)).value;
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AttributeEntity;
exports.fragment = new index_1.ClassFactoryFragment('entities/htmlAttribute', AttributeEntity);
//# sourceMappingURL=attribute.js.map