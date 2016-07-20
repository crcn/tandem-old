"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
require('./template.scss');
const node_1 = require('saffron-common/src/section/node');
const fragment_1 = require('saffron-common/src/section/fragment');
const bubble_iframe_events_1 = require('saffron-common/src/utils/html/bubble-iframe-events');
const index_1 = require('saffron-common/src/fragments/index');
class RegisteredEntityController {
    constructor(properties) {
        Object.assign(this, properties);
        this.section = new fragment_1.default();
    }
    load(options) {
        return __awaiter(this, void 0, void 0, function* () {
            for (var childExpression of this.frame.expression.childNodes) {
                this.entity.appendChild(yield childExpression.load(Object.assign({}, options, {
                    selectable: false
                })));
            }
        });
    }
}
class FrameEntityController {
    constructor(properties) {
        Object.assign(this, properties);
        // flag the entity as isolated (iframes are) so that visual
        // calculations work properly for child node.
        this.entity.isolated = true;
        // hacky, but we need the zoom.
        this.app.actors.push({
            execute: (event) => {
                if (event.type === 'change') {
                    for (var change of event.changes) {
                        if (change.target === this.app && change.property === 'zoom') {
                            setTimeout(this.setZoom.bind(this, this.app.zoom), 100);
                        }
                    }
                }
            }
        });
        this.section = new node_1.default(document.createElement('iframe'));
    }
    /**
     * janky, but we need to copy zoom from the app since
     * iframes do not inherit the property.
     */
    setZoom() {
        this.iframe.contentWindow.document.body.style.zoom = this.app.zoom;
    }
    setAttribute(key, value) {
        this.attributes[key] = value;
    }
    load(options) {
        var iframe = this.iframe = options.section.targetNode;
        iframe.setAttribute('class', 'm-entity-controller-template');
        options.fragments.register(new index_1.FactoryFragment(`entity-controllers/${this.attributes.id}`, {
            create: this.createElementController.bind(this)
        }));
        iframe.addEventListener('load', () => __awaiter(this, void 0, void 0, function* () {
            bubble_iframe_events_1.default(iframe);
            var body = iframe.contentWindow.document.body;
            var bodySection = new node_1.default(body);
            Object.assign(bodySection.targetNode.style, {
                margin: 0,
                padding: 0,
            });
            this.setZoom();
            for (var childExpression of this.expression.childNodes) {
                yield this.entity.appendChild(yield childExpression.load(Object.assign({}, options, {
                    section: bodySection
                })));
            }
        }));
    }
    createElementController(properties) {
        return new RegisteredEntityController(Object.assign({}, properties, {
            frame: this
        }));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FrameEntityController;
exports.fragment = new index_1.ClassFactoryFragment('entity-controllers/template', FrameEntityController);
//# sourceMappingURL=template.js.map