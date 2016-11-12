import "./index.scss";
import * as React from "react";
import { TreeComponent } from "@tandem/editor/browser/components/common";
import { BaseApplicationComponent, TreeNode } from "@tandem/common";

export class NavigatorPaneComponent extends BaseApplicationComponent<{ file: TreeNode<any> }, any> {
  render() {
    return <div className="modules-pane">
      <div className="td-section-header">
        Files
      </div>
      <TreeComponent
        nodes={this.props.file ? [this.props.file] : []}
        select={node => false}
        isNodeHovering={node => false}
        isNodeSelected={node => false}
        renderLabel={node => node["name"]}
        isNodeExpanded={node => true}
        toggleExpand={node => false}
         />
    </div>
  }
}