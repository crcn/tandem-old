"use strict";
const mesh_1 = require('mesh');
class Service {
    /**
     * Takes target as argument which contains all the handlers
     */
    constructor() {
    }
    execute(action) {
        var actor = this[action.type];
        if (actor) {
            // child classes must use loggable mixin
            if (this.logger) {
                this.logger.verbose('execute %s', action.type);
            }
            return mesh_1.WrapBus.create(typeof actor === 'function' ? actor.bind(this) : actor).execute(action);
        }
        return new mesh_1.EmptyResponse();
    }
    addActor(actionType, actor) {
        actor = mesh_1.WrapBus.create(actor);
        var existingActor;
        if (existingActor = this[actionType]) {
            if (existingActor._busses) {
                existingActor._busses.push(actor);
            }
            else {
                this[actionType] = new mesh_1.ParallelBus([existingActor, actor]);
            }
        }
        else {
            this[actionType] = actor;
        }
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Service;
//# sourceMappingURL=base.js.map