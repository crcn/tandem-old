"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const mesh_1 = require('mesh');
const sift = require('sift');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    create(bus) {
        return mesh_1.AcceptBus.create(sift({ type: 'upsert' }), {
            execute(action) {
                return mesh_1.Response.create(function (writable) {
                    return __awaiter(this, void 0, void 0, function* () {
                        var chunk = yield bus.execute({
                            type: 'find',
                            query: action.query,
                            collectionName: action.collectionName,
                        }).read();
                        writable.write((yield bus.execute({
                            type: !chunk.done ? 'update' : 'insert',
                            data: action.data,
                            query: action.query,
                            collectionName: action.collectionName,
                        }).read()).value);
                        writable.close();
                    });
                });
            },
        }, bus);
    },
};
//# sourceMappingURL=upsert.js.map