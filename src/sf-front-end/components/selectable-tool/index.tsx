import * as cx from "classnames";
import * as React from "react";
import { Workspace } from "sf-front-end/models";
import { SelectAction } from "sf-front-end/actions";
import { FrontEndApplication } from "sf-front-end/application";
import { SelectablesComponent } from "sf-front-end/components/selectables";
import { IVisibleEntity, IEntity } from "sf-core/ast/entities";
import { ReactComponentFactoryDependency } from "sf-front-end/dependencies";

// @injectable
export default class SelectableToolComponent extends React.Component<{selection: any, allEntities: Array<IEntity>, bus: any, app: any, zoom: number, workspace: Workspace }, {}>  {

  onEntityMouseDown = (entity: IVisibleEntity, event: MouseEvent) => {
    this.props.app.bus.execute(new SelectAction(entity, event.shiftKey));
  }

  render() {
    return <SelectablesComponent {...this.props} onEntityMouseDown={this.onEntityMouseDown} />;
  }
}

export const dependency = new ReactComponentFactoryDependency("components/tools/pointer/selectable", SelectableToolComponent);
