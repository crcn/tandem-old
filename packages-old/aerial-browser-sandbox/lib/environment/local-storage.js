"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common2_1 = require("aerial-common2");
exports.getSEnvLocalStorageClass = aerial_common2_1.weakMemo(function (context) {
    var SEnvLocalStorage = /** @class */ (function () {
        function SEnvLocalStorage(entries, _onChange) {
            if (_onChange === void 0) { _onChange = function () { }; }
            this._onChange = _onChange;
            this._data = new Map(entries);
        }
        Object.defineProperty(SEnvLocalStorage.prototype, "length", {
            get: function () {
                return this._data.size;
            },
            enumerable: true,
            configurable: true
        });
        SEnvLocalStorage.prototype.clear = function () {
            this._data.clear();
            this._didChange();
        };
        SEnvLocalStorage.prototype.getItem = function (key) {
            return this._data.get(key);
        };
        SEnvLocalStorage.prototype.key = function (index) {
            var entries = Array.from(this._data.entries());
            return entries[index] && entries[index][0];
        };
        SEnvLocalStorage.prototype.removeItem = function (key) {
            this._data.delete(key);
            this._didChange();
        };
        SEnvLocalStorage.prototype.setItem = function (key, data) {
            this._data.set(key, data);
            this._didChange();
        };
        SEnvLocalStorage.prototype._didChange = function () {
            this._onChange(Array.from(this._data.entries()));
        };
        return SEnvLocalStorage;
    }());
    return SEnvLocalStorage;
});
//# sourceMappingURL=local-storage.js.map