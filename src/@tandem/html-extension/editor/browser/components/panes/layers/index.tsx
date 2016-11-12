import "./index.scss";

import * as cx from "classnames";
import * as React from "react";
import { Workspace } from "@tandem/editor/browser/models";
import { TreeComponent } from "@tandem/editor/browser/components/common";
import { MetadataKeys } from "@tandem/editor/browser/constants";
import { BaseApplicationComponent } from "@tandem/common";
import { SyntheticDOMNode, SyntheticDOMElement, SyntheticDOMContainer, SyntheticDOMText, SyntheticDOMComment, DOMNodeType } from "@tandem/synthetic-browser";

export class LayersPaneComponent extends BaseApplicationComponent<{ workspace: Workspace }, any> {

  selectNode = (node) => {
    this.props.workspace.select(node);
  }

  toggleExpand = (node: SyntheticDOMContainer) => {
    console.log(node);
    const expand = !node.metadata.get(MetadataKeys.LAYER_EXPANDED);
    node.metadata.set(MetadataKeys.LAYER_EXPANDED, expand);

    if (!expand) {
      node.querySelectorAll("*").forEach(child => child.metadata.set(MetadataKeys.LAYER_EXPANDED, false));
    }
  }

  onMouseEnter = (node: SyntheticDOMNode) => {
    node.metadata.set(MetadataKeys.HOVERING, true);
  }

  onMouseLeave = (node: SyntheticDOMNode) => {
    node.metadata.set(MetadataKeys.HOVERING, false);
  }

  render() {
    if (!this.props.workspace) return null;
    const { document, selection } = this.props.workspace;
    if (!document) return null;

    return <div className="html-layers-pane">
      <div className="td-section-header">
        Layers
      </div>
      <TreeComponent
        nodes={document.body.children}
        select={node => this.props.workspace.select(node as SyntheticDOMNode)}
        isNodeHovering={node => (node as SyntheticDOMNode).metadata.get(MetadataKeys.HOVERING)}
        isNodeSelected={node => this.props.workspace.selection.indexOf(node as SyntheticDOMNode) !== -1}
        isNodeExpanded={node => (node as SyntheticDOMNode).metadata.get(MetadataKeys.LAYER_EXPANDED)}
        getChildNodes={node => node["contentDocument"] ? node["contentDocument"].body.childNodes : node.children}
        toggleExpand={this.toggleExpand.bind(this)}
        renderLabel={this.renderLabel.bind(this)}
      />
    </div>;
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