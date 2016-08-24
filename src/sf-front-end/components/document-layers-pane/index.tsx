import "./index.scss";

import * as React from "react";
import PaneComponent from "sf-front-end/components/pane";
import LayerComponent from "./layer";

import { IEntity } from "sf-core/entities";
import HTML5Backend from "react-dnd-html5-backend";
import { Workspace } from "sf-front-end/models";
import { DragDropContext } from "react-dnd";
import { IContainerEntity } from "sf-core/entities";
import { FrontEndApplication } from "sf-front-end/application";
import { DocumentPaneComponentFactoryDependency } from "sf-front-end/dependencies";

class LayersPaneComponent extends React.Component<{ workspace: Workspace, app: FrontEndApplication }, any> {
  render() {
    if (!this.props.workspace.file || !this.props.workspace.file.document.root) return null;
    return <PaneComponent title="Layers">
      {
        (this.props.workspace.file.document.root as IContainerEntity).childNodes.map((entity: IEntity, i) => <LayerComponent depth={0} {...this.props} entity={entity} key={i} />)
      }
    </PaneComponent>;
  }
}

export const dependency = new DocumentPaneComponentFactoryDependency("layers", DragDropContext(HTML5Backend)(LayersPaneComponent));
