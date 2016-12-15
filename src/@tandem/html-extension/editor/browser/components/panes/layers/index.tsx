import "./index.scss";

import cx =  require("classnames");
import React =  require("react");
import { Workspace } from "@tandem/editor/browser/stores";
import { MetadataKeys } from "@tandem/editor/browser/constants";
import { TreeComponent } from "@tandem/uikit";
import { SyntheticSourceLink } from "@tandem/editor/browser/components/common";
import { BaseApplicationComponent } from "@tandem/common";
import { ElementLayerLabelProvider } from "@tandem/html-extension/editor/browser/providers";
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
        nodes={this.filterChildren(document.body.childNodes)}
        select={this.selectNode.bind(this)}
        onNodeMouseEnter={node => (node as SyntheticDOMNode).metadata.set(MetadataKeys.HOVERING, true)}
        onNodeMouseLeave={node => (node as SyntheticDOMNode).metadata.set(MetadataKeys.HOVERING, false)}
        isNodeHovering={node => (node as SyntheticDOMNode).metadata.get(MetadataKeys.HOVERING)}
        isNodeSelected={node => this.props.workspace.selection.indexOf(node as SyntheticDOMNode) !== -1}
        isNodeExpanded={node => (node as SyntheticDOMNode).metadata.get(MetadataKeys.LAYER_EXPANDED)}
        getChildNodes={node => this.filterChildren(node["contentDocument"] ? node["contentDocument"].documentElement.childNodes || [] : node.children)}
        toggleExpand={this.toggleExpand.bind(this)}
        renderLabel={this.renderNode.bind(this)}
      />
    </div>;
  }

  filterChildren(nodes: SyntheticDOMNode[]) {
    return nodes.filter((node) => node.nodeType !== DOMNodeType.COMMENT);
  }

  renderNode(node: SyntheticDOMNode, renderOuter: (inner) => any) {
    const label = this.renderLabel(node, renderOuter);

    if (!label) return null;

    return <SyntheticSourceLink target={node}>
      { label }
    </SyntheticSourceLink>;
  }

  renderLabel(node: SyntheticDOMNode, renderDefault?: any): any {
    switch(node.nodeType) {
      case DOMNodeType.TEXT: return this.renderText(node as SyntheticDOMText, renderDefault);
      case DOMNodeType.ELEMENT: return this.renderElement(node as SyntheticDOMElement, renderDefault);
    }
    return null;
  }

  renderText({ uid, textContent }: SyntheticDOMText, renderDefault) {
    if (!/\S+/.test(textContent || "")) return null;
    return renderDefault(<div className="entity text">
      {textContent}
    </div>);
  }

  renderElement(element: SyntheticDOMElement, renderOuterLabel) {

    const { attributes, tagName } = element;

    if (attributes["data-td-hide-layer"]) return null;
    
    const layerLabelProvider = ElementLayerLabelProvider.find(tagName, this.injector);
    
    if (layerLabelProvider) {
      return layerLabelProvider.create({ element, renderOuterLabel });
    }

    return renderOuterLabel(<div className="node element">
      <div className="open-tag">

        <span key="tag-name" className="tag-name">{ tagName }</span>
        { attributes["id"] && <span key="id" className="entity html attribute id">#{attributes["id"].value}</span>}
        { attributes["class"] && <span key="class" className="entity html attribute class">.{attributes["class"].value}</span>}

      </div>
    </div>);
  }
}