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
const io_1 = require('saffron-common/src/services/io');
const SocketIOClient = require('socket.io-client');
const index_1 = require('saffron-common/src/fragments/index');
let BackEndService = class BackEndService extends io_1.default {
    /**
     * initializes the back-end actor
     */
    load() {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            yield _super("load").call(this);
            this.logger.info('starting socket.io client on port %d', this.app.config.socketio.port);
            this._client = SocketIOClient(`//${window.location.hostname}:${this.app.config.socketio.port}`);
            yield this.addConnection(this._client);
        });
    }
};
BackEndService = __decorate([
    loggable_1.default
], BackEndService);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BackEndService;
exports.fragment = new index_1.ApplicationServiceFragment('application/services/back-end', BackEndService);
//# sourceMappingURL=back-end.js.map