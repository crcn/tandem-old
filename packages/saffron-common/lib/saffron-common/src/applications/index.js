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
const decorators_1 = require("saffron-core/src/decorators");
const actions_1 = require("saffron-core/src/actions");
const fragments_1 = require("saffron-base/src/fragments");
const mesh_1 = require("mesh");
// import { ApplicationServiceFragment } from "../fragments/index";
// import { fragment as consoleLogFragment } from "../services/console-output";
// @observable
let Application = class Application {
    constructor(config = {}) {
        this.config = config;
        this.actors = [];
        this.bus = new mesh_1.ParallelBus(this.actors);
        this.fragments = new fragments_1.FragmentDictionary();
        this._registerFragments();
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._initialized) {
                throw new Error("Cannot initialize application twice.");
            }
            this._initialized = true;
            this._initializeActors();
            this.willInitialize();
            yield this.bus.execute(new actions_1.LoadAction());
            yield this.bus.execute(new actions_1.InitializeAction());
            this.didInitialize();
        });
    }
    /**
     */
    _registerFragments() {
        if (!process.env.TESTING) {
        }
    }
    /**
     */
    _initializeActors() {
        /*
        queryAllApplicationServiceFragments(this.fragments)
        */
        // this.actors.push(...this.fragments.queryAll<ApplicationServiceFragment>("application/services/**").map((fragment: ApplicationServiceFragment) => (
        //   fragment.create(this)
        // )));
    }
    /**
     */
    willInitialize() {
        // OVERRIDE ME
    }
    /**
     */
    didInitialize() {
        this.logger.info("initialized");
    }
};
__decorate([
    decorators_1.bindable()
], Application.prototype, "loading", void 0);
Application = __decorate([
    decorators_1.loggable()
], Application);
exports.Application = Application;
//# sourceMappingURL=index.js.map