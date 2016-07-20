"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const index_1 = require('saffron-common/src/fragments/index');
const index_2 = require('saffron-common/src/object/index');
const sass = require('sass.js');
const fragment_1 = require('saffron-common/src/section/fragment');
class StyleEntityController extends index_2.default {
    constructor(properties) {
        super(properties);
        this.section = new fragment_1.default();
        this.entity.visible = false;
    }
    setAttribute(key, value) { }
    load({ section }) {
        return __awaiter(this, void 0, void 0, function* () {
            var source = this.entity.expression.childNodes[0].nodeValue;
            // TODO
            // const _watchFile = async (path) => {
            //   var stream = this.bus.execute({
            //     type: 'watchFile',
            //     path: path
            //   });
            //   let value;
            //   while ({ value } = await stream.read()) {
            //     console.log(value);
            //   }
            // };
            sass.importer((request, resolve) => __awaiter(this, void 0, void 0, function* () {
                // _watchFile(request.resolved);
                resolve((yield this.bus.execute({
                    type: 'readFile',
                    path: request.resolved
                }).read()).value);
            }));
            var { text } = (yield new Promise((resolve, reject) => {
                sass.compile(source, { inputPath: this.file.path }, function (result) {
                    if (result.text)
                        return resolve(result);
                    reject(result);
                });
            }));
            var node = this.node = document.createElement('style');
            node.setAttribute('type', 'text/css');
            node.appendChild(document.createTextNode(text));
            section.appendChild(node);
        });
    }
    update() {
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StyleEntityController;
class EntityControllerFactoryFragment extends index_1.ClassFactoryFragment {
    constructor(ns, clazz, test) {
        super(ns, clazz);
        this.test = test;
    }
}
exports.fragment = new EntityControllerFactoryFragment('entity-controllers/style', StyleEntityController, (entity) => (entity.attributes.type === 'text/scss'));
//# sourceMappingURL=style.js.map