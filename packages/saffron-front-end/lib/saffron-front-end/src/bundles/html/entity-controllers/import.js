"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const index_1 = require('saffron-common/src/object/index');
const path = require('path');
const index_2 = require('saffron-common/src/fragments/index');
// import SfnFile from 'browser/fragments/sfn-file-handler/model';
class SfnFile {
    constructor(any) {
    }
}
class ImportEntityController extends index_1.default {
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            var files = yield this.bus.load({
                type: 'getFiles',
                src: path.join(path.dirname(this.file.path), this.attributes.src),
                public: true,
            }).readAll();
            files = files.map((data) => (new SfnFile(Object.assign({}, data, {
                bus: this.bus,
                fragments: this.fragments,
            }))));
            for (var file of files) {
                yield file.load();
                // the entity is root, so it has a section
                this.section.appendChild(file.entity.section.toFragment());
            }
        });
    }
}
exports.fragment = new index_2.ClassFactoryFragment('entity-controllers/import', ImportEntityController);
//# sourceMappingURL=import.js.map