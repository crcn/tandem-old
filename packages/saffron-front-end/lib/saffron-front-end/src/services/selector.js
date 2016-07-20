"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const loggable_1 = require('saffron-common/src/decorators/loggable');
const base_application_service_1 = require('saffron-common/src/services/base-application-service');
const index_1 = require('saffron-common/src/fragments/index');
const collection_1 = require('selection/collection');
let SelectorService = class SelectorService extends base_application_service_1.default {
    load() {
        this.app.selection = [];
    }
    /**
     */
    select({ items, toggle, keepPreviousSelection }) {
        const app = this.app;
        if (!items.length) {
            return app.setProperties({
                selection: []
            });
        }
        const prevSelection = app.selection;
        const type = items[0].type;
        const newSelectionFragment = this.app.fragments.query(`selection-collections/${type}`);
        const newSelection = newSelectionFragment ? newSelectionFragment.create() : new collection_1.default();
        if (keepPreviousSelection && newSelection.constructor === prevSelection.constructor) {
            newSelection.push(...prevSelection);
        }
        else {
            newSelection.push(...prevSelection.filter((item) => !!~items.indexOf(item)));
        }
        for (const item of items) {
            var i = newSelection.indexOf(item);
            if (~i) {
                if (toggle) {
                    newSelection.splice(i, 1);
                }
            }
            else {
                newSelection.push(item);
            }
        }
        app.setProperties({
            selection: newSelection
        });
    }
};
SelectorService = __decorate([
    loggable_1.default
], SelectorService);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SelectorService;
exports.fragment = new index_1.ApplicationServiceFragment('application/services/selector', SelectorService);
//# sourceMappingURL=selector.js.map