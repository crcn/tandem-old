import "./index.scss";
import * as React from "react";
import * as cx from "classnames";
import { TreeNode } from "@tandem/common"

export interface ITreeComponentProps {
  nodes: TreeNode<any>[];
  renderRoot?: boolean;
  renderLabel: (node: TreeNode<any>) => any;
  select: (node: TreeNode<any>) => any;
  renderLayer?: (component: any) => any;
  getLayerClassName?: (node: TreeNode<any>) => string;
  getChildNodes?: (node: TreeNode<any>) => TreeNode<any>[];
  isNodeHovering(node: TreeNode<any>);
  isNodeSelected(node: TreeNode<any>);
  isNodeExpanded(node: TreeNode<any>);
  toggleExpand(node: TreeNode<any>);
}

export class TreeComponent extends React.Component<ITreeComponentProps, any> {

  expandLayer = () => {

  }

  render() {
    return <div className="tree">
      {this.renderChildNodes(this.props.nodes, 1)}
    </div>;
  }

  renderNode(node: TreeNode<any>, depth: number): any {

    const expanded = this.props.isNodeExpanded(node);

    return <div className="node">

      <div className={cx({ label: true, hovering: this.props.isNodeHovering(node), selected: this.props.isNodeSelected(node), "no-wrap": true })} style={{paddingLeft: 8 + depth * 8 }}>
        <i key="arrow" onClick={this.props.toggleExpand.bind(this, node)} className={[expanded ? "ion-arrow-down-b" : "ion-arrow-right-b"].join(" ")} style={{ opacity: node.children.length ? 0.5 : 0 }} />
        <span onClick={this.props.select.bind(this, node)}>{this.props.renderLabel(node)}</span>
      </div>

      {expanded ? this.renderChildNodes(this.getChildNodes(node), depth + 1) : null}
    </div>
  }

  renderLayer(component) {
    return this.props.renderLayer && this.props.renderLayer(component) || component;
  }

  renderChildNodes(nodes: TreeNode<any>[], depth: number) {
    return <div>
      { nodes.map((node, key) => {
        return <span key={key}>{this.renderNode(node, depth)}</span>
      })}
    </div>;
  }

  protected getChildNodes(node: TreeNode<any>): TreeNode<any>[] {
    return this.props.getChildNodes && this.props.getChildNodes(node) || node.children;
  }
}