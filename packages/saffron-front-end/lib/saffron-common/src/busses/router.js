"use strict";
const mesh_1 = require('mesh');
class RouterBus extends mesh_1.Bus {
    constructor(routes) {
        super();
        this._routes = {};
        for (const key in routes) {
            this._routes[key] = mesh_1.WrapBus.create(routes[key]);
        }
    }
    execute(event) {
        const bus = this._routes[event.type];
        if (bus) {
            return bus.execute(event);
        }
        return mesh_1.EmptyResponse.create();
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RouterBus;
//# sourceMappingURL=router.js.map