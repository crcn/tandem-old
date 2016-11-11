import "./index.scss";

import * as cx from "classnames";
import * as React from "react";
import { Workspace } from "@tandem/editor/browser/models";
import { MetadataKeys } from "@tandem/editor/browser/constants";
import { BaseApplicationComponent } from "@tandem/common";
import { SyntheticDOMNode, SyntheticDOMElement, SyntheticDOMText, SyntheticDOMComment, DOMNodeType } from "@tandem/synthetic-browser";

export class LayersPaneComponent extends BaseApplicationComponent<{ workspace: Workspace }, any> {

  selectNode = (node) => {
    this.props.workspace.select(node);
  }

  expandLayer = (node: SyntheticDOMNode) => {
    node.metadata.toggle(MetadataKeys.LAYER_EXPANDED);
  }

  render() {
    if (!this.props.workspace) return null;
    const { document, selection } = this.props.workspace;
    if (!document) return null;

    return <div className="html-layers-pane">
      <div className="td-section-header">
        Layers
      </div>
      {this.renderChildNodes(document.body.childNodes, 1)}
    </div>
  }

  renderLayer(node: SyntheticDOMNode, depth: number): any {
    const expanded = node.metadata.get(MetadataKeys.LAYER_EXPANDED);
    const hovering = node.metadata.get(MetadataKeys.HOVERING);

    return <div key={node.uid} className="layer">
      <div className={cx({ label: true, hovering: hovering, selected: this.props.workspace.selection.indexOf(node) !== -1, "no-wrap": true })} style={{paddingLeft: 8 + depth * 8 }}>
        <i key="arrow" onClick={this.expandLayer.bind(this, node)} className={[expanded ? "ion-arrow-down-b" : "ion-arrow-right-b"].join(" ")} style={{ opacity: node.childNodes.length ? 0.5 : 0 }} />
        <span onClick={this.selectNode.bind(this, node)}>{this.renderLabel(node, depth)}</span>
      </div>
      {expanded ? this.renderChildNodes(node["contentDocument"] ? node["contentDocument"].body.childNodes : node.childNodes, depth + 1) : null}
    </div>;
  }

  renderChildNodes(childNodes: SyntheticDOMNode[], depth: number) {
    return <div>
      { childNodes.map((node) => {
        return this.renderLayer(node, depth);
      })}
    </div>
  }

  renderLabel(node: SyntheticDOMNode, depth: number): any {
    switch(node.nodeType) {
      case DOMNodeType.TEXT: return this.renderText(node as SyntheticDOMText);
      case DOMNodeType.COMMENT: return this.renderComment(node as SyntheticDOMComment);
      case DOMNodeType.ELEMENT: return this.renderElement(node as SyntheticDOMElement, depth);
    }
    return null;
  }

  renderComment({ uid, nodeValue }: SyntheticDOMComment) {
    return <div className="node comment">
      { nodeValue }
    </div>;
  }

  renderText({ uid, nodeValue }: SyntheticDOMText) {
    return <div className="node text">
      { nodeValue }
    </div>;
  }

  renderElement({ uid, tagName, attributes, childNodes}: SyntheticDOMElement, depth: number) {

    return <div className="node element">
      <div className="open-tag">

        <span key="tag-name" className="tag-name">{ tagName }</span>
        { attributes["id"] && <span key="id" className="attribute id">#{attributes["id"].value}</span>}
        { attributes["class"] && <span key="class" className="attribute class">.{attributes["class"].value}</span>}

      </div>
    </div>
  }
}