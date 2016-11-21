import "./index.scss";

import * as cx from "classnames";
import * as React from "react";
import { Workspace } from "@tandem/editor/browser/models";
import { MetadataKeys } from "@tandem/editor/browser/constants";
import { TreeComponent } from "@tandem/uikit";
import { SyntheticSourceLink } from "@tandem/editor/browser/components/common";
import { BaseApplicationComponent } from "@tandem/common";
import { SyntheticDOMNode, SyntheticDOMElement, SyntheticDOMContainer, SyntheticDOMText, SyntheticDOMComment, DOMNodeType } from "@tandem/synthetic-browser";

export class LayersPaneComponent extends BaseApplicationComponent<{ workspace: Workspace }, any> {

  selectNode = (node, event: React.MouseEvent<any>) => {
    this.props.workspace.select(node, event.shiftKey, true);
  }

  toggleExpand = (node: SyntheticDOMContainer) => {
    const expand = !node.metadata.get(MetadataKeys.LAYER_EXPANDED);
    node.metadata.set(MetadataKeys.LAYER_EXPANDED, expand);

    if (!expand) {
      node.querySelectorAll("*").forEach(child => child.metadata.set(MetadataKeys.LAYER_EXPANDED, false));
    }
  }

  onLabelMouseEnter = (node: SyntheticDOMNode, event: React.MouseEvent<any>) => {
  }

  onMouseLeave = (node: SyntheticDOMNode) => {
  }


  render() {
    if (!this.props.workspace) return null;
    const { document, selection } = this.props.workspace;
    if (!document) return null;

    return <div className="html-layers-pane">
      <div className="header">
        Layers
      </div>
      <TreeComponent
        nodes={this.filterChildren(document.body.children)}
        select={this.selectNode.bind(this)}
        onNodeMouseEnter={node => (node as SyntheticDOMNode).metadata.set(MetadataKeys.HOVERING, true)}
        onNodeMouseLeave={node => (node as SyntheticDOMNode).metadata.set(MetadataKeys.HOVERING, false)}
        isNodeHovering={node => (node as SyntheticDOMNode).metadata.get(MetadataKeys.HOVERING)}
        isNodeSelected={node => this.props.workspace.selection.indexOf(node as SyntheticDOMNode) !== -1}
        isNodeExpanded={node => (node as SyntheticDOMNode).metadata.get(MetadataKeys.LAYER_EXPANDED)}
        getChildNodes={node => this.filterChildren(node["contentDocument"] ? node["contentDocument"].body.childNodes : node.children)}
        toggleExpand={this.toggleExpand.bind(this)}
        renderLabel={this.renderLabelOuter.bind(this)}
      />
    </div>;
  }

  filterChildren(nodes: SyntheticDOMNode[]) {
    return nodes.filter((node) => node.nodeType !== DOMNodeType.COMMENT);
  }

  renderLabelOuter(node: SyntheticDOMNode, depth: number) {
    return <SyntheticSourceLink target={node}>
      {this.renderLabel(node, depth)}
    </SyntheticSourceLink>;
  }

  renderLabel(node: SyntheticDOMNode, depth: number): any {
    switch(node.nodeType) {
      case DOMNodeType.TEXT: return this.renderText(node as SyntheticDOMText);
      case DOMNodeType.ELEMENT: return this.renderElement(node as SyntheticDOMElement, depth);
    }
    return null;
  }

  renderText({ uid, nodeValue }: SyntheticDOMText) {
    return <div className="entity text">
      { nodeValue }
    </div>;
  }

  renderElement({ uid, tagName, attributes, childNodes}: SyntheticDOMElement, depth: number) {

    return <div className="node element">
      <div className="open-tag">

        <span key="tag-name" className="tag-name">{ tagName }</span>
        { attributes["id"] && <span key="id" className="entity html attribute id">#{attributes["id"].value}</span>}
        { attributes["class"] && <span key="class" className="entity html attribute class">.{attributes["class"].value}</span>}

      </div>
    </div>
  }
}