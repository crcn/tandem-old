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
const node_1 = require('saffron-common/src/section/node');
const fragment_1 = require('saffron-common/src/section/fragment');
const index_1 = require('saffron-common/src/fragments/index');
const group_1 = require('../preview/group');
const node_2 = require('../preview/node');
function convertStyle(style) {
    const converted = {};
    for (const key in style) {
        let v = style[key];
        if (/left|top|margin|width|height/.test(key) && !isNaN(v)) {
            v = v + 'px';
        }
        converted[key] = v;
    }
    return converted;
}
class ElementEntity extends entity_1.default {
    constructor(properties) {
        super(Object.assign({}, properties, {
            type: 'display'
        }));
        this.context = {};
    }
    set style(value) {
        this._style = convertStyle(value);
        Object.assign(this.section.targetNode.style, convertStyle(value));
    }
    get style() {
        return this._style || {};
    }
    load(options) {
        return __awaiter(this, void 0, void 0, function* () {
            var attributes = {};
            for (const attribute of this.expression.attributes) {
                attributes[attribute.key] = (yield attribute.load(options)).value;
            }
            this.attributes = attributes;
            var controllerFragment = options
                .fragments
                .queryAll(`entity-controllers/${this.expression.nodeName}`)
                .find((fragment) => !fragment.test || (fragment.test(this) ? fragment : void 0));
            var ref;
            var section;
            var context = this.context;
            Object.assign(context, options.context || {}, context, attributes);
            if (controllerFragment) {
                ref = this.ref = controllerFragment.create(Object.assign(this, options, {
                    attributes: attributes,
                    expression: this.expression,
                    context: this.context,
                    entity: this
                }));
                section = ref.section;
                if (ref.section === options.section) {
                    throw new Error('ref section must not be parent section');
                }
                yield ref.load(Object.assign({}, options, {
                    context,
                    section
                }));
            }
            else {
                ref = document.createElement(this.expression.nodeName);
                for (const key in attributes) {
                    ref.setAttribute(key, attributes[key]);
                }
                section = new node_1.default(ref);
                for (var childExpression of this.expression.childNodes) {
                    this.appendChild(yield childExpression.load(Object.assign({}, options, {
                        context,
                        section
                    })));
                }
            }
            if (this.visible !== false) {
                if (section instanceof fragment_1.default) {
                    this.preview = new group_1.default(this);
                }
                else {
                    this.preview = new node_2.default(this);
                }
            }
            this.section = section;
            options.section.appendChild(section.toFragment());
        });
    }
    update(options) {
        return __awaiter(this, void 0, void 0, function* () {
            for (var child of this.childNodes) {
                child.update(options);
            }
        });
    }
    willUnmount() {
        this.section.remove();
    }
}
exports.fragment = new index_1.ClassFactoryFragment('entities/htmlElement', ElementEntity);
//# sourceMappingURL=element.js.map