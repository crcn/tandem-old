import * as cx from "classnames";
import * as React from "react";
import { Editor } from "tandem-front-end/models";
import { SelectAction } from "tandem-front-end/actions";
import { FrontEndApplication } from "tandem-front-end/application";
import { SelectablesComponent } from "tandem-front-end/components/selectables";
import { IVisibleEntity, IEntity } from "tandem-common/lang/entities";
import { ReactComponentFactoryDependency } from "tandem-front-end/dependencies";

// @injectable
export default class SelectableToolComponent extends React.Component<{selection: any, allEntities: Array<IEntity>, bus: any, app: any, zoom: number, editor: Editor }, {}>  {

  onEntityMouseDown = (entity: IVisibleEntity, event: MouseEvent) => {
    this.props.app.bus.execute(new SelectAction(entity, event.shiftKey));
  }

  render() {
    return <SelectablesComponent {...this.props} onEntityMouseDown={this.onEntityMouseDown} />;
  }
}

export const selectableToolComponentDependency = new ReactComponentFactoryDependency("components/tools/pointer/selectable", SelectableToolComponent);
