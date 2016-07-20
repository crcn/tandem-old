"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const index_1 = require('saffron-common/src/object/index');
const xml_peg_1 = require('saffron-common/src/parsers/xml.peg');
const observable_1 = require('saffron-common/src/decorators/observable');
const index_2 = require('saffron-common/src/fragments/index');
let SfnFile = class SfnFile extends index_1.default {
    /**
     */
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            var expression = xml_peg_1.parse(this.content);
            var options = {
                bus: this.bus,
                file: this,
                app: this.app,
                fragments: this.isolate !== false ? this.fragments.createChild() : this.fragments
            };
            // patch(this.expression, expression, undefined);
            // this.entity.update(options);
            this.expression = expression;
            var entity = yield expression.load(options);
            this.setProperties({
                expression,
                entity
            });
        });
    }
    /**
     */
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('save saffron file');
        });
    }
};
SfnFile = __decorate([
    observable_1.default
], SfnFile);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SfnFile;
exports.fragment = new index_2.ClassFactoryFragment('models/sfn-file', SfnFile);
//# sourceMappingURL=sfn-file.js.map