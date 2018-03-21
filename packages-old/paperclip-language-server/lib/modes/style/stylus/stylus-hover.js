"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vscode_languageserver_types_1 = require("vscode-languageserver-types");
var parser_1 = require("./parser");
// import {
//   inspect
// } from 'util'
var cssSchema = require("./css-schema");
var _ = require("lodash");
function stylusHover(document, position) {
    var ast = parser_1.buildAst(document.getText());
    if (!ast) {
        return {
            contents: ''
        };
    }
    var node = parser_1.findNodeAtPosition(ast, position);
    if (!node) {
        return {
            contents: 'no node found!'
        };
    }
    if (node.__type === 'Property') {
        var property_1 = node.segments[0].name;
        var properties = cssSchema.data.css.properties;
        var item = _.find(properties, function (item) { return item.name === property_1; });
        var lineno = node.lineno - 1;
        var column = node.column;
        return {
            contents: (item && item.desc) || 'unknown property',
            range: vscode_languageserver_types_1.Range.create(lineno, column, lineno, column + properties.length)
        };
    }
    return {
        contents: []
    };
}
exports.stylusHover = stylusHover;
//# sourceMappingURL=stylus-hover.js.map