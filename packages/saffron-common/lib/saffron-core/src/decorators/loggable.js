"use strict";
const logger_1 = require("../logger");
const mesh_1 = require("mesh");
const noopBus = new mesh_1.NoopBus();
function default_1() {
    return (clazz) => {
        Object.defineProperty(clazz.prototype, "logger", {
            get() {
                return this._logger || (this._logger = new logger_1.Logger(this.bus || noopBus, `${this.constructor.name}:`));
            }
        });
        return clazz;
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
//# sourceMappingURL=loggable.js.map