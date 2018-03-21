"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./grid.scss");
var React = require("react");
var recompose_1 = require("recompose");
exports.GridStageToolBase = function (_a) {
    var translate = _a.translate;
    if (translate.zoom <= 12)
        return null;
    var size = 20000;
    var gridSize = 1;
    var paths = [
        // horizontal
        [[0, 0], [gridSize, 0]],
        // vertical
        [[0, 0], [0, gridSize]]
    ];
    return React.createElement("div", { className: "m-grid-tool", style: { left: -size / 2, top: -size / 2 } },
        React.createElement("svg", { width: size, height: size, viewBox: "0 0 " + size + " " + size },
            React.createElement("defs", null,
                React.createElement("pattern", { id: "grid", width: gridSize / size, height: gridSize / size },
                    React.createElement("g", { stroke: "#d8d8d8" }, paths.map(function (_a, i) {
                        var _b = _a[0], sx = _b[0], sy = _b[1], _c = _a[1], ex = _c[0], ey = _c[1];
                        return React.createElement("path", { strokeWidth: 1 / translate.zoom, key: i, d: "M" + sx + "," + sy + " L" + ex + "," + ey });
                    })))),
            React.createElement("rect", { fill: "url(#grid)", width: size, height: size })));
};
exports.GridStageTool = recompose_1.compose(recompose_1.pure)(exports.GridStageToolBase);
//# sourceMappingURL=grid.js.map