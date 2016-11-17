import "./index.scss";
import * as cx from "classnames";
import * as React from "react";
import { TreeNode } from "@tandem/common"

export interface ITreeComponentProps {
  nodes: TreeNode<any>[];
  renderRoot?: boolean;
  renderLabel: (node: TreeNode<any>) => any;
  select: (node: TreeNode<any>, event?: React.MouseEvent<any>) => any;
  renderLayer?: (component: any) => any;
  getLayerClassName?: (node: TreeNode<any>) => string;
  getChildNodes?: (node: TreeNode<any>) => TreeNode<any>[];
  hasChildren?: (node: TreeNode<any>) => boolean;
  isNodeHovering(node: TreeNode<any>);
  onNodeMouseEnter?(node: TreeNode<any>, event?: React.MouseEvent<any>);
  onNodeMouseLeave?(node: TreeNode<any>, event?: React.MouseEvent<any>);
  isNodeSelected(node: TreeNode<any>);
  onNodeDragStart?(node: TreeNode<any>, event: React.DragEvent<any>);
  isNodeDraggable?(node: TreeNode<any>): boolean;
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

      <div onMouseEnter={this.onMouseEnter.bind(this, node)} onMouseLeave={this.onMouseLeave.bind(this, node)} draggable={this.isDraggable(node)} onDragStart={this.onDragStart.bind(this, node)} className={cx({ label: true, hovering: this.props.isNodeHovering(node), selected: this.props.isNodeSelected(node), "no-wrap": true })} style={{paddingLeft: 8 + depth * 8 }}>
        <i key="arrow" onClick={this.props.toggleExpand.bind(this, node)} className={[expanded ? "ion-arrow-down-b" : "ion-arrow-right-b"].join(" ")} style={{ opacity: this.hasChildren(node) ? 0.5 : 0 }} />
        <span onClick={this.props.select.bind(this, node)}>{this.props.renderLabel(node)}</span>
      </div>

      {expanded ? this.renderChildNodes(this.getChildNodes(node), depth + 1) : null}
    </div>
  }

  onMouseEnter(node: TreeNode<any>, event: React.MouseEvent<any>) {
    if (this.props.onNodeMouseEnter) this.props.onNodeMouseEnter(node, event);
  }

  onMouseLeave(node: TreeNode<any>, event: React.MouseEvent<any>) {
    if (this.props.onNodeMouseEnter) this.props.onNodeMouseLeave(node, event);
  }

  onDragStart(node: TreeNode<any>, event: React.DragEvent<any>): boolean {
    return this.props.onNodeDragStart && this.props.onNodeDragStart(node, event);
  }

  isDraggable(node: TreeNode<any>): boolean {
    return this.props.isNodeDraggable && this.props.isNodeDraggable(node);
  }

  hasChildren(node) {
    return this.props.hasChildren && this.props.hasChildren(node) || node.children.length;
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