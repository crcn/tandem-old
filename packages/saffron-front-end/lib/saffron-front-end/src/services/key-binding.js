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
const Mousetrap = require('mousetrap');
let KeyBindingService = class KeyBindingService extends base_application_service_1.default {
    initialize() {
        this.app
            .fragments
            .queryAll('key-bindings/**').forEach((fragment) => {
            this._addKeyBinding(fragment.create({ app: this.app, bus: this.bus }));
        });
    }
    _addKeyBinding(keyBinding) {
        this.logger.verbose('add key %s', keyBinding.key);
        Mousetrap.bind(keyBinding.key, (event) => {
            this.logger.verbose('handle key %s', keyBinding.key);
            keyBinding.execute({
                key: keyBinding.key
            });
            event.preventDefault();
        });
    }
};
KeyBindingService = __decorate([
    loggable_1.default
], KeyBindingService);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = KeyBindingService;
exports.fragment = new index_1.ApplicationServiceFragment('application/services/key-binding', KeyBindingService);
//# sourceMappingURL=key-binding.js.map