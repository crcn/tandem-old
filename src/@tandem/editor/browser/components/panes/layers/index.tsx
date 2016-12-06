import "./index.scss";

import React =  require("React");
import { PaneComponent } from "@tandem/editor/browser/components/common";
import LayerComponent from "./layer";
import { findTreeNode, BaseApplicationComponent } from "@tandem/common";
import path =  require("path");

import HTML5Backend from "react-dnd-html5-backend";
import { DragDropContext } from "react-dnd";
import { DocumentPaneComponentFactoryProvider } from "@tandem/editor/browser/providers";

class _LayersPaneComponent extends BaseApplicationComponent<{}, any> {
  render() {
    const workspace = null;
    if (!workspace || !workspace.document) return null;
    return <PaneComponent title={path.basename(workspace.browser.location.toString())}>
      {
        workspace.document.body.children.map((node, i) => <LayerComponent depth={0} node={node} key={node.uid} />)
      }
    </PaneComponent>;
  }
}

export const LayersPaneComponent = DragDropContext(HTML5Backend)(_LayersPaneComponent as any);

