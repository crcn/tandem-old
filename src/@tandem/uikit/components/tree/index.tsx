import "./index.scss";
import * as React from "react";
import { TreeNode } from "@tandem/common/tree";

export interface ITreeComponentProps {
  depth?: number;
  nodes: TreeNode<any>[];
  renderLabel(node: TreeNode<any>): any;
}

export interface ITreeNodeProps {
  depth: number;
  node: TreeNode<any>;
  renderLabel(node: TreeNode<any>): any;
}

export class TreeNodeComponent extends React.Component<ITreeNodeProps, any> {
  render() {
    const { node, depth, renderLabel } = this.props;

    const hasChildren = node.children.length;

    const expandButtonStyle = {
      visibility: hasChildren ? "visible": "hidden",
      cursor: hasChildren ? "pointer" : "default"
    };

    const nodeLabelStyle = {
      paddingLeft: depth * 8
    }

    return <div className="node">
      <div className="node-label" style={nodeLabelStyle}>
        <i className="ion-arrow-down-b expand-button" style={expandButtonStyle} />
        { renderLabel(node) }
      </div>
      <TreeComponent nodes={node.children} depth={depth + 1} renderLabel={renderLabel} />
    </div>;
  }
}

export class TreeComponent extends React.Component<ITreeComponentProps, any> {
  render() {
    const { nodes, renderLabel, depth } = this.props;
    return <div className="tree">
      { nodes.map((node, i) => <TreeNodeComponent key={i} node={node} renderLabel={renderLabel} depth={depth || 1} />) }
    </div>
  }
}