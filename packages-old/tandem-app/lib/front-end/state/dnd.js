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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var actions_1 = require("../actions");
exports.withDragSource = function (handler) { return function (BaseComponent) {
    var DraggableComponentClass = /** @class */ (function (_super) {
        __extends(DraggableComponentClass, _super);
        function DraggableComponentClass() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DraggableComponentClass.prototype.render = function () {
            var _this = this;
            return React.createElement(BaseComponent, __assign({ connectDragSource: function (element) {
                    return React.cloneElement(element, {
                        draggable: true,
                        onDragStart: function (event) {
                            if (handler.start) {
                                handler.start(_this.props)(event);
                            }
                            _this.props.dispatch(actions_1.dndStarted(handler.getData(_this.props), event));
                        },
                        onDragEnd: function (event) { return _this.props.dispatch(actions_1.dndEnded(handler.getData(_this.props), event)); },
                    });
                } }, this.props));
        };
        return DraggableComponentClass;
    }(React.Component));
    return DraggableComponentClass;
}; };
//# sourceMappingURL=dnd.js.map