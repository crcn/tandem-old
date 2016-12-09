import { omit } from "lodash";
import React =  require("react");
import { CSS_MIME_TYPE } from "@tandem/common";
import sm = require("source-map");
import postcss = require("postcss");

import {
  parseCSS,
  evaluateCSS,
  SyntheticDOMText,
  SyntheticDOMElement,
  SyntheticCSSStyleSheet,
} from "@tandem/synthetic-browser";

export class SyntheticHTMLStyle extends SyntheticDOMElement {

  private _styleSheet: SyntheticCSSStyleSheet;

  attachedCallback() {
    super.attachedCallback();
    this.ownerDocument.styleSheets.push(this.getStyleSheet());
  }

  getStyleSheet() {
    if (this._styleSheet) return this._styleSheet;
    this._styleSheet = new SyntheticCSSStyleSheet([]);
    const firstChild = this.firstChild;
    const firstChildSource = firstChild && firstChild.$source;
    let textContent = this.textContent;

    // add whitespace to the text content so that the $source start & end lines are correct
    if (firstChildSource) {
      textContent = _generateOffsetCSSText(textContent, firstChild as SyntheticDOMText);
    }

    this._styleSheet.$ownerNode = this;
    this._styleSheet.cssText = textContent;
    return this._styleSheet;
  }

  detachedCallback() {
    this.ownerDocument.styleSheets.splice(this.ownerDocument.styleSheets.indexOf(this._styleSheet), 1);
  }

  onChildAdded(child, index) {
    super.onChildAdded(child, index);
    if (this._styleSheet) {
      this._styleSheet.cssText = this.textContent;
    }
  }

  get styleSheet() {
    return this._styleSheet;
  }
}

const _generateOffsetCSSText = (css: string, textNode: SyntheticDOMText) => {

  const offsetSource = textNode.$source.start;
  const offsetLine   = offsetSource.line;
  const offsetColumn = offsetSource.column;
  const sourceUri = textNode.$source.uri;


  const root = postcss().process(css).root;

  const compile = (node: postcss.Node): sm.SourceNode => {
    const line = node.source.start.line + offsetLine - 1;
    const column = node.source.start.column - 1;

    if (node.type === "root") {
      return new sm.SourceNode(offsetLine, offsetColumn, sourceUri, (<postcss.Container>node).nodes.map(compile));
    } else if (node.type === "rule") {
      const rule = <postcss.Rule>node;
      return new sm.SourceNode(line, column, sourceUri, [rule.selector, `{`, ...rule.nodes.map(compile), `}`]);
    } else if (node.type === "decl") {
      const decl = <postcss.Declaration>node;
      return new sm.SourceNode(line, column, sourceUri, [decl.prop, `:`, decl.value, `;`])
    } else if (node.type === "atrule") {
      const atrule = <postcss.AtRule>node;
      return new sm.SourceNode(line, column, sourceUri, [`@${atrule.name} ${atrule.params} {`, ...atrule.nodes.map(compile),`}`]);
    }
  }
  
  const { code, map } = compile(root).toStringWithSourceMap({
    file: sourceUri
  });

  const sourceMappingURL = `data:application/json;base64,${new Buffer(map.toString()).toString("base64")}`;

  return `${code}\n/*# sourceMappingURL=${sourceMappingURL} */`;
}