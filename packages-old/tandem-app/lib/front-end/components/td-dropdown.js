"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("React");
var td_dropdown_pc_1 = require("./td-dropdown.pc");
var recompose_1 = require("recompose");
exports.DropdownMenu = td_dropdown_pc_1.hydrateTdDropdownMenu(recompose_1.compose(recompose_1.pure, recompose_1.withHandlers({
    onOptionSelected: function (_a) { return function (option) {
        console.log("ITEM", option);
    }; }
}), function (Base) { return function (_a) {
    var options = _a.options, onOptionSelected = _a.onOptionSelected;
    var optionProps = options.map(function (option) { return (__assign({}, option, { onClick: onOptionSelected.bind(_this, option) })); });
    return React.createElement(Base, { options: optionProps });
}; }), {
    TdList: null,
    TdListItem: null
});
exports.DropdownButton = td_dropdown_pc_1.hydrateTdDropdownButton(recompose_1.compose(recompose_1.pure, function (Base) { return function (_a) {
    var open = _a.open, options = _a.options, children = _a.children, rest = __rest(_a, ["open", "options", "children"]);
    return React.createElement(Base, __assign({ open: open, options: options }, rest), children);
}; }), {
    TdDropdownMenu: exports.DropdownMenu
});
//# sourceMappingURL=td-dropdown.js.map