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
var events_1 = require("../events");
exports.getL3EventClasses = aerial_common2_1.weakMemo(function (context) {
    var SEnvEvent = events_1.getSEnvEventClasses(context).SEnvEvent;
    var SEnvMutationEvent = /** @class */ (function (_super) {
        __extends(SEnvMutationEvent, _super);
        function SEnvMutationEvent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SEnvMutationEvent.prototype.initMutationEvent = function (typeArg, canBubbleArg, cancelableArg, relatedNodeArg, prevValueArg, newValueArg, attrNameArg, attrChangeArg) {
            _super.prototype.initEvent.call(this, typeArg, canBubbleArg, cancelableArg);
            this.relatedNode = relatedNodeArg;
            this.prevValue = prevValueArg;
            this.newValue = newValueArg;
            this.attrName = attrNameArg;
            this.attrChange = attrChangeArg;
        };
        return SEnvMutationEvent;
    }(SEnvEvent));
    return {
        SEnvMutationEvent: SEnvMutationEvent
    };
});
//# sourceMappingURL=event.js.map