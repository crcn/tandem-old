"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const fragment_1 = require('saffron-common/src/section/fragment');
const index_1 = require('saffron-common/src/fragments/index');
class RepeatEntityController {
    constructor(properties) {
        Object.assign(this, properties);
    }
    setAttribute(key, value) {
        this.attributes[key] = value;
    }
    load(options) {
        return __awaiter(this, void 0, void 0, function* () {
            var each = Number(this.attributes.each);
            for (var i = each; i--;) {
                for (var childExpression of this.expression.childNodes) {
                    var childSection = new fragment_1.default();
                    this.entity.appendChild(yield childExpression.load(Object.assign({}, options, {
                        section: childSection
                    })));
                    options.section.appendChild(childSection.toFragment());
                }
            }
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RepeatEntityController;
exports.fragment = new index_1.ClassFactoryFragment('entity-controllers/repeat', RepeatEntityController);
//# sourceMappingURL=repeat.js.map