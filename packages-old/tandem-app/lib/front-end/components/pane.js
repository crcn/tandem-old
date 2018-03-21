"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var recompose_1 = require("recompose");
var pane_pc_1 = require("./pane.pc");
var enhance = recompose_1.compose(recompose_1.pure);
exports.Pane = pane_pc_1.hydrateTdPane(enhance, {});
//# sourceMappingURL=pane.js.map