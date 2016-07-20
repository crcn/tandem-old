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
const loggable_1 = require('../decorators/loggable');
const observable_1 = require('../decorators/observable');
const collection_1 = require('../object/collection');
const index_1 = require('../object/index');
const collection_2 = require('../fragments/collection');
const mesh_1 = require('mesh');
const index_2 = require('../actions/index');
const console_output_1 = require('../services/console-output');
let BaseApplication = class BaseApplication extends index_1.default {
    constructor(config = {}) {
        super({});
        this.config = config;
        // contains most dependencies for the application.
        this.fragments = new collection_2.default();
        // acts on events dispatched by the central bus
        this.actors = new collection_1.default();
        // the central bus which dispatches all actions & events
        // to all actors of the applicaton
        this.bus = mesh_1.ParallelBus.create(this.actors);
        // register all parts of the application here
        this._registerFragments();
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._initialized) {
                throw new Error('Cannot initialize application twice.');
            }
            this._initialized = true;
            this._initializeActors();
            this.willInitialize();
            this.setProperties({ loading: true });
            yield this.bus.execute(new index_2.LoadAction());
            yield this.bus.execute(new index_2.InitializeAction());
            this.setProperties({ loading: false });
            this.didInitialize();
        });
    }
    /**
     */
    _registerFragments() {
        if (!process.env.TESTING) {
            this.fragments.register(console_output_1.fragment);
        }
    }
    /**
     */
    _initializeActors() {
        this.actors.push(...this.fragments.queryAll('application/services/**').map((fragment) => (fragment.create(this))));
    }
    /**
     */
    willInitialize() {
        // OVERRIDE ME
    }
    /**
     */
    didInitialize() {
        this.logger.info('initialized');
    }
};
BaseApplication = __decorate([
    observable_1.default,
    loggable_1.default
], BaseApplication);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BaseApplication;
//# sourceMappingURL=base.js.map