"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var babel = require("babel-core");
var babylon = require("babylon");
var sm = require("source-map");
var babel_types_1 = require("babel-types");
// TODO - consider other prefixes here instead of react
module.exports = function (content, contentMap) {
    this.cacheable();
    if (!contentMap)
        return content;
    var lines = content.split("\n");
    var transformHTMLStrings = true;
    var sourceMapConsumer = new sm.SourceMapConsumer(contentMap);
    function isJSXCall(call) {
        return /^React.createElement/.test(getSourceChunk(call.loc));
    }
    function getSourceChunk(loc) {
        var chunk = lines.slice(loc.start.line - 1, loc.end.line);
        chunk[0] = chunk[0].substr(loc.start.column);
        chunk[chunk.length - 1] = chunk[chunk.length - 1].substr(0, loc.end.column);
        return chunk.join("\n");
    }
    function transformJSXElementCall(elementCall) {
        var attrArg = elementCall.arguments[1];
        if (attrArg.type === "ObjectExpression") {
            var objExpression = attrArg;
            var originalPosition = sourceMapConsumer.originalPositionFor(elementCall.loc.start);
            var source = {
                kind: null,
                uri: "file://" + originalPosition.source,
                start: {
                    line: originalPosition.line,
                    column: originalPosition.column,
                },
            };
            // attributes which cannot be edited by Tandem
            var disableAttributes = [];
            for (var _i = 0, _a = objExpression.properties; _i < _a.length; _i++) {
                var property = _a[_i];
                var _b = property, key = _b.key, value = _b.value;
                if (value.type !== "StringLiteral") {
                    disableAttributes.push(key.name);
                }
            }
            if (disableAttributes.length) {
                objExpression.properties.push(babel_types_1.objectProperty(babel_types_1.stringLiteral("data-_readonly"), babel_types_1.stringLiteral(JSON.stringify(disableAttributes))));
            }
            objExpression.properties.push(babel_types_1.objectProperty(babel_types_1.stringLiteral("data-_source"), babel_types_1.stringLiteral(JSON.stringify(source))));
            // React.createElement("div", null, ["child"]);
        }
        else if (attrArg.type === "NullLiteral") {
            elementCall.arguments[1] = babel_types_1.objectExpression([]);
            transformJSXElementCall(elementCall);
        }
    }
    var tandemPlugin = {
        visitor: {
            CallExpression: function (path) {
                if (isJSXCall(path.node)) {
                    transformJSXElementCall(path.node);
                }
            }
        }
    };
    var contentAST = babylon.parse(content);
    var _a = babel.transformFromAst(contentAST, content, {
        inputSourceMap: contentMap,
        plugins: [tandemPlugin]
    }), code = _a.code, map = _a.map, ast = _a.ast;
    return code;
};
//# sourceMappingURL=jsx-source-transformer.js.map