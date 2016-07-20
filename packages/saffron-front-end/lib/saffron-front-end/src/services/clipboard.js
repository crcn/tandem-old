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
const loggable_1 = require('saffron-common/src/decorators/loggable');
const base_application_service_1 = require('saffron-common/src/services/base-application-service');
const index_1 = require('saffron-common/src/fragments/index');
function targetIsInput(event) {
    return /input|textarea/i.test(event.target.nodeName);
}
let ClipboardService = class ClipboardService extends base_application_service_1.default {
    constructor(...args) {
        super(...args);
        this._paste = (item) => __awaiter(this, void 0, void 0, function* () {
            try {
            }
            catch (e) {
                this.logger.warn('cannot paste x-entity data: ', item.type);
            }
        });
    }
    initialize() {
        document.addEventListener('copy', (event) => {
            if (targetIsInput(event))
                return;
            this.logger.info('handle copy');
            // var selection = this.app.selection.map((entity) => (
            //   entity.expression
            // ));
            var selection = [];
            event.clipboardData.setData('text/x-entity', JSON.stringify(selection));
            event.preventDefault();
        });
        document.addEventListener('paste', (event) => {
            this.logger.info('handle paste');
            Array.prototype.forEach.call(event.clipboardData.items, this._paste);
        });
    }
};
ClipboardService = __decorate([
    loggable_1.default
], ClipboardService);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ClipboardService;
exports.fragment = new index_1.ApplicationServiceFragment('application/services/clipboard', ClipboardService);
//# sourceMappingURL=clipboard.js.map