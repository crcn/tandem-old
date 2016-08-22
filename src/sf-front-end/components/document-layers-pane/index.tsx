import "./index.scss";

import * as React from "react";
import PaneComponent from "sf-front-end/components/pane";
import LayerComponent from "./layer";

import { Workspace } from "sf-front-end/models";
import HTML5Backend from "react-dnd-html5-backend";
import { DragDropContext } from "react-dnd";
import { IContainerEntity } from 'sf-core/entities';
import { DocumentPaneComponentFactoryDependency } from "sf-front-end/dependencies";


class LayersPaneComponent extends React.Component<{ workspace: Workspace }, any> {
  render() {
    if (!this.props.workspace.file || !this.props.workspace.file.document.root) return null;
    return <PaneComponent title="Layers">
      {
        (this.props.workspace.file.document.root as IContainerEntity).childNodes.map((entity, i) => <LayerComponent {...this.props} entity={entity} key={i} />)
      }
    </PaneComponent>;
  }
}

export const dependency = new DocumentPaneComponentFactoryDependency("layers", DragDropContext(HTML5Backend)(LayersPaneComponent));
