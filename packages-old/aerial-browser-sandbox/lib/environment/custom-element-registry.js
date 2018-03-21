"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common2_1 = require("aerial-common2");
exports.getSEnvCustomElementRegistry = aerial_common2_1.weakMemo(function (options) {
    return /** @class */ (function () {
        function SEnvCustomElementRegistry(_window) {
            this._window = _window;
            this._registry = {};
            this._definedPromises = {};
            this._definedPromiseResolvers = {};
        }
        SEnvCustomElementRegistry.prototype.define = function (name, constructor, options) {
            // TODO - throw error if already registered
            this._registry[name] = constructor;
            if (this._definedPromiseResolvers[name]) {
                this._definedPromiseResolvers[name]();
            }
        };
        SEnvCustomElementRegistry.prototype.get = function (name) {
            return this._registry[name.toLowerCase()];
        };
        SEnvCustomElementRegistry.prototype.whenDefined = function (name) {
            var _this = this;
            if (this._registry[name])
                return Promise.resolve();
            return this._definedPromises[name] || (this._definedPromises[name] = new Promise(function (resolve) {
                _this._definedPromiseResolvers[name] = function () {
                    _this._definedPromises[name] = _this._definedPromiseResolvers[name] = undefined;
                    resolve();
                };
            }));
        };
        return SEnvCustomElementRegistry;
    }());
});
//# sourceMappingURL=custom-element-registry.js.map