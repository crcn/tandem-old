import "./index.scss";
import * as React from "react";
import { TreeComponent } from "@tandem/editor/browser/components/common";
import { OpenFileAction } from "@tandem/editor/common/actions";
import {  StoreProvider } from "@tandem/editor/browser/providers";
import { Store, Workspace } from "@tandem/editor/browser/models";
import { DirectoryModel, FileModel, BaseFSModel } from "@tandem/editor/common/models";
import { BaseApplicationComponent, TreeNode, inject } from "@tandem/common";

export class NavigatorPaneComponent extends BaseApplicationComponent<{ store?: Store, workspace: Workspace }, any> {
  @inject(StoreProvider.ID)
  private _store: Store;

  render() {
    const cwd = (this.props.store || this._store).cwd;
    if (!this.props.workspace) return null;

    return <div className="modules-pane">
      <div className="td-section-header">
        {cwd.name}
      </div>
      <TreeComponent
        nodes={cwd.children}
        select={node => {
          this.props.workspace.select(node)
          if (!node.children.length && node instanceof DirectoryModel) {
            (node as DirectoryModel).load();
          }

          if (node instanceof FileModel) {
            this.bus.execute(new OpenFileAction(node.path));
          }
        }}
        isNodeDraggable={node => {
          return !(node instanceof DirectoryModel);
        }}
        onNodeDragStart={(node: FileModel, event: React.DragEvent<any>) => {
          event.dataTransfer.setData("URI", node.path);
        }}
        isNodeHovering={node => false}
        isNodeSelected={node => this.props.workspace.selection.indexOf(node) !== -1}
        renderLabel={node => (node as BaseFSModel).name}
        hasChildren={node => node instanceof DirectoryModel}
        isNodeExpanded={node => node.children.length}
        toggleExpand={node => node.children.length ? node.removeAllChildren() : (node as DirectoryModel).load()}
         />
    </div>
  }
}