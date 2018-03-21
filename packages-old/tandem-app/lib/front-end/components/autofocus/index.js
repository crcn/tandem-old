"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ReactDOM = require("react-dom");
var recompose_1 = require("recompose");
var AutofocusBase = function (_a) {
    var children = _a.children;
    return children;
};
var enhanceAutofocus = recompose_1.compose(recompose_1.pure, recompose_1.lifecycle({
    componentDidMount: function () {
        if (this.props.focus !== false) {
            ReactDOM.findDOMNode(this).focus();
        }
        if (this.props.select !== false) {
            ReactDOM.findDOMNode(this).select();
        }
    }
}));
exports.Autofocus = enhanceAutofocus(AutofocusBase);
//# sourceMappingURL=index.js.map