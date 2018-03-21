"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common2_1 = require("aerial-common2");
exports.getDOMExceptionClasses = aerial_common2_1.weakMemo(function (context) {
    var SEnvDOMException = /** @class */ (function (_super) {
        __extends(SEnvDOMException, _super);
        function SEnvDOMException() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return SEnvDOMException;
    }(Error));
    return {
        SEnvDOMException: SEnvDOMException
    };
});
//# sourceMappingURL=exceptions.js.map