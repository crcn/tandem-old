"use strict";
const index_1 = require('../logger/index');
const mesh_1 = require('mesh');
const noopBus = new mesh_1.NoopBus();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (clazz) => {
    Object.defineProperty(clazz.prototype, 'logger', {
        get() {
            return this._logger || (this._logger = new index_1.default(this.bus, `${this.constructor.name}:`));
        },
    });
    return clazz;
};
//# sourceMappingURL=loggable.js.map