import "./index.scss";
import * as React from "react";
import { TreeComponent } from "@tandem/editor/browser/components/common";
import { OpenFileAction } from "@tandem/editor/common/actions";
import {  StoreProvider } from "@tandem/editor/browser/providers";
import { Store, Workspace } from "@tandem/editor/browser/models";
import { Directory, File, BaseFSModel } from "@tandem/editor/common/models";
import { BaseApplicationComponent, TreeNode, inject } from "@tandem/common";

export class NavigatorPaneComponent extends BaseApplicationComponent<{ store?: Store, workspace: Workspace }, any> {
  @inject(StoreProvider.ID)
  private _store: Store;

  render() {
    const cwd = (this.props.store || this._store).cwd;

    return <div className="modules-pane">
      <div className="td-section-header">
        {cwd.name}
      </div>
      <TreeComponent
        nodes={cwd.children}
        select={node => {
          this.props.workspace.select(node)
          if (!node.children.length && node instanceof Directory) {
            (node as Directory).load();
          }

          if (node instanceof File) {
            this.bus.execute(new OpenFileAction((node as File).path));
          }
        }}
        isNodeHovering={node => false}
        isNodeSelected={node => this.props.workspace.selection.indexOf(node) !== -1}
        renderLabel={node => (node as BaseFSModel).name}
        hasChildren={node => node instanceof Directory}
        isNodeExpanded={node => node.children.length}
        toggleExpand={node => node.children.length ? node.removeAllChildren() : (node as Directory).load()}
         />
    </div>
  }
}