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
const fragment_1 = require('saffron-common/src/section/fragment');
// import NodeSection from 'saffron-common/src/selection/node';
class GroupEntity extends entity_1.default {
    load(options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.section = new fragment_1.default();
            for (var childExpression of this.expression.childNodes) {
                yield this.appendChild(yield childExpression.load(Object.assign({}, options, {
                    section: this.section
                })));
            }
        });
    }
    update(options) {
        return __awaiter(this, void 0, void 0, function* () {
            var childNodes = this.childNodes.concat();
            for (var i = 0, n = this.expression.childNodes.length; i < n; i++) {
                var cexpr = this.expression.childNodes[i];
                if (i < this.childNodes.length) {
                    var child = childNodes.find((childNode) => (childNode.expression === cexpr));
                    if (child) {
                        yield child.update(options);
                        if (child !== this.childNodes[i]) {
                            // re-order
                            this.insertBefore(child, this.childNodes[i]);
                        }
                    }
                    else {
                        var replChild = yield cexpr.load(Object.assign({}, options, {
                            section: this.section
                        }));
                        var oldChild = this.childNodes[i];
                        this.insertBefore(replChild, oldChild);
                        this.removeChild(oldChild);
                    }
                }
                else {
                    yield this.appendChild(yield cexpr.load(Object.assign({}, options, {
                        section: this.section
                    })));
                }
            }
        });
    }
    willUnmount() {
        this.section.remove();
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GroupEntity;
exports.fragment = new index_1.ClassFactoryFragment('entities/group', GroupEntity);
//# sourceMappingURL=group.js.map