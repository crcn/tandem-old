import * as babel from "babel-core";
import * as babylon from "babylon";
import { Visitor, NodePath } from "babel-traverse";
import * as sm from "source-map";
import { ISyntheticSourceInfo } from "@tandem/sandbox";
import {
  NullLiteral,
  CallExpression,
  SourceLocation,
  ObjectProperty,
  ObjectExpression,
  objectProperty,
  objectExpression,
  stringLiteral
} from "babel-types";

// TODO - consider other prefixes here instead of react
module.exports = (content, contentMap) => {
  if (!contentMap) return content;

  const lines = content.split("\n");
  const transformHTMLStrings = true;
  const sourceMapConsumer = new sm.SourceMapConsumer(contentMap);

  function isJSXCall(call: CallExpression) {
    return /^React.createElement/.test(getSourceChunk(call.loc));
  }

  function getSourceChunk(loc: SourceLocation) {
    const chunk = lines.slice(loc.start.line - 1, loc.end.line);
    chunk[0] = chunk[0].substr(loc.start.column);
    chunk[chunk.length - 1] = chunk[chunk.length - 1].substr(0, loc.end.column);
    return chunk.join("\n");
  }

  function transformJSXElementCall(elementCall: CallExpression) {
    const attrArg = elementCall.arguments[1];
    if (attrArg.type === "ObjectExpression") {
      const objExpression = <ObjectExpression>attrArg;
      const originalPosition = sourceMapConsumer.originalPositionFor(elementCall.loc.start);

      const source: ISyntheticSourceInfo = {
        kind: null,
        filePath: originalPosition.source,
        start: {
          line: originalPosition.line,
          column: originalPosition.column,
        },
      };

      objExpression.properties.push(
        objectProperty(
          stringLiteral("data-source"),
          stringLiteral(JSON.stringify(source))
        )
      );

    // React.createElement("div", null, ["child"]);
    } else if ((attrArg as any).type === "NullLiteral") {
      elementCall.arguments[1] = objectExpression([]);
      transformJSXElementCall(elementCall);
    }
  }


  const tandemPlugin = {
    visitor: <Visitor>{
      CallExpression(path) {
        if (isJSXCall(path.node)) {
          transformJSXElementCall(path.node);
        }
      }
    }
  };

  const contentAST = babylon.parse(content);
  const { code, map, ast } = babel.transformFromAst(contentAST, content, {
    inputSourceMap: contentMap,
    plugins: [tandemPlugin]
  });

  return code;
}