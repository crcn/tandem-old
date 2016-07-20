"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const sift = require('sift');
const ReactDOM = require('react-dom');
const loggable_1 = require('saffron-common/src/decorators/loggable');
const filter_action_1 = require('saffron-common/src/actors/decorators/filter-action');
const base_application_service_1 = require('saffron-common/src/services/base-application-service');
const index_1 = require('saffron-common/src/fragments/index');
let RootComponentRenderer = class RootComponentRenderer extends base_application_service_1.default {
    constructor(...args) {
        super(...args);
        this.render = () => {
            this._rendering = false;
            var app = this.app;
            var rootComponentClassFragment = this.app.fragments.query('rootComponentClass');
            ReactDOM.render(rootComponentClassFragment.create({
                app: app,
                bus: app.bus
            }), app.element);
        };
    }
    execute() {
        if (this._rendering)
            return;
        this._rendering = true;
        setTimeout(this.render, 10);
    }
};
__decorate([
    filter_action_1.default(sift({
        type: {
            $ne: /log/,
        },
    }))
], RootComponentRenderer.prototype, "execute", null);
RootComponentRenderer = __decorate([
    loggable_1.default
], RootComponentRenderer);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RootComponentRenderer;
exports.fragment = new index_1.ApplicationServiceFragment('application/services/root-component-renderer', RootComponentRenderer);
//# sourceMappingURL=root-component-renderer.js.map