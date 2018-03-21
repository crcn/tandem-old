"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Url = require("url");
var aerial_common2_1 = require("aerial-common2");
exports.getSEnvLocationClass = aerial_common2_1.weakMemo(function (context) {
    return /** @class */ (function () {
        function SEnvLocation(_urlStr, _reload) {
            this._urlStr = _urlStr;
            this._reload = _reload;
            this.hash = "";
            this.hostname = "";
            this.href = "";
            this.pathname = "";
            this.port = "";
            this.protocol = "";
            this.search = "";
            this.host = "";
            var parts = Url.parse(_urlStr);
            for (var key in parts) {
                this[key] = parts[key] || "";
            }
            this.origin = this.protocol + "//" + this.host;
        }
        SEnvLocation.prototype.assign = function (url) {
            // TODO
        };
        SEnvLocation.prototype.reload = function (forceReload) {
            if (this._reload) {
                this._reload();
            }
        };
        SEnvLocation.prototype.replace = function (uri) {
        };
        SEnvLocation.prototype.toString = function () {
            return this._urlStr;
        };
        return SEnvLocation;
    }());
});
//# sourceMappingURL=location.js.map