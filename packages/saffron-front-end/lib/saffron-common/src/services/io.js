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
const public_1 = require('../actors/decorators/public');
const document_1 = require('../actors/decorators/document');
const SocketIOBus = require('mesh-socket-io-bus');
const index_1 = require('../services/index');
const mesh_1 = require('mesh');
const base_application_service_1 = require('./base-application-service');
let IOService = class IOService extends base_application_service_1.default {
    constructor(...args) {
        super(...args);
        /**
         */
        this.addConnection = (connection) => __awaiter(this, void 0, void 0, function* () {
            this.logger.info('client connected');
            var remoteService = new index_1.Service();
            // from here on, all global actions will touch on this remote service object.
            // If the action is registered to the service, that action will be executed
            // against the remote client.
            this._remoteActors.push(remoteService);
            // setup the bus which will facilitate in all
            // transactions between the remote service
            var remoteBus = SocketIOBus.create({
                connection: connection
            }, this._publicService);
            // fetch the remote action types, and set them to the remote service
            // so that we limit the number of outbound actions
            for (const remoteActionType of yield remoteBus.execute({ type: 'getPublicActionTypes' }).readAll()) {
                this.logger.verbose('adding remote action "%s"', remoteActionType);
                remoteService.addActor(remoteActionType, new mesh_1.ParallelBus([
                    remoteBus
                ]));
            }
            connection.once('disconnect', () => {
                this.logger.info('client disconnected');
                this._remoteActors.splice(this._remoteActors.indexOf(remoteService), 1);
            });
        });
    }
    load() {
        // this is the public service which handles all
        // incomming actions
        this._publicService = new index_1.Service();
        // scan the application for all public actions and add
        // then to the public service
        for (const actor of this.app.actors) {
            for (const actionType of (actor.__publicProperties || [])) {
                this.logger.info(`exposing ${actor.constructor.name}.${actionType}`);
                this._publicService.addActor(actionType, actor);
            }
        }
        // remote actors which take actions from the server
        this._remoteActors = [];
        // add the remote actors to the application so that they
        // receive actions from other parts of the application
        this.app.actors.push(mesh_1.ParallelBus.create(this._remoteActors));
    }
    /**
     * returns the publicly accessible actors
     */
    getPublicActionTypes() {
        return Object.keys(this._publicService);
    }
    /**
     */
    ping() {
        return 'pong';
    }
    /**
     */
    getRemoteConnectionCount() {
        return this._remoteActors.length;
    }
};
__decorate([
    public_1.default,
    document_1.default('returns the public action types')
], IOService.prototype, "getPublicActionTypes", null);
__decorate([
    public_1.default,
    document_1.default('pings remote connections')
], IOService.prototype, "ping", null);
__decorate([
    document_1.default('returns the number of remote connections')
], IOService.prototype, "getRemoteConnectionCount", null);
IOService = __decorate([
    loggable_1.default
], IOService);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = IOService;
//# sourceMappingURL=io.js.map