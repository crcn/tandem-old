"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var recompose_1 = require("recompose");
var enhanced_1 = require("front-end/components/enhanced");
exports.ElementGutterBase = function (_a) {
    var workspace = _a.workspace, dispatch = _a.dispatch;
    return React.createElement(enhanced_1.Gutter, { left: false, right: true },
        React.createElement(enhanced_1.CSSInpectorPane, { workspace: workspace, dispatch: dispatch }));
};
var enhanceElementGutter = recompose_1.compose(recompose_1.pure);
exports.ElementGutter = enhanceElementGutter(exports.ElementGutterBase);
//# sourceMappingURL=index.js.map