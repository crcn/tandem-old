import "./index.scss";

import * as React from "react";
import { PaneComponent } from "@tandem/editor/components/common";
import LayerComponent from "./layer";
import { findTreeNode } from "@tandem/common";
import * as path from "path";

import HTML5Backend from "react-dnd-html5-backend";
import { DragDropContext } from "react-dnd";
import { FrontEndApplication } from "@tandem/editor/application";
import { DocumentPaneComponentFactoryDependency } from "@tandem/editor/dependencies";

class LayersPaneComponent extends React.Component<{ app: FrontEndApplication }, any> {
  render() {
    const { editor } = this.props.app;
    if (!editor || !editor.document) return null;
    return <PaneComponent title={path.basename(editor.browser.location.toString())}>
      {
        editor.document.body.children.map((node, i) => <LayerComponent depth={0} {...this.props} node={node} key={node.uid} />)
      }
    </PaneComponent>;
  }
}

export const layersPaneComponentDepency = new DocumentPaneComponentFactoryDependency("layers", DragDropContext(HTML5Backend)(LayersPaneComponent));
