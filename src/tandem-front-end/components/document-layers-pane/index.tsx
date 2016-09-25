import "./index.scss";

import * as React from "react";
import PaneComponent from "tandem-front-end/components/pane";
import LayerComponent from "./layer";

import HTML5Backend from "react-dnd-html5-backend";
import { Workspace } from "tandem-front-end/models";
import { DragDropContext } from "react-dnd";
import { FrontEndApplication } from "tandem-front-end/application";
import { DocumentPaneComponentFactoryDependency } from "tandem-front-end/dependencies";

class LayersPaneComponent extends React.Component<{ workspace: Workspace, app: FrontEndApplication }, any> {
  render() {
    if (!this.props.workspace || !this.props.workspace.file.entity) return null;
    return <PaneComponent>
      {
        this.props.workspace.file.entity.children.map((entity, i) => <LayerComponent depth={0} {...this.props} entity={entity} key={i} />)
      }
    </PaneComponent>;
  }
}

export const layersPaneComponentDepency = new DocumentPaneComponentFactoryDependency("layers", DragDropContext(HTML5Backend)(LayersPaneComponent));
