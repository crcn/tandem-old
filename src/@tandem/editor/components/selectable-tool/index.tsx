import * as cx from "classnames";
import * as React from "react";
import { Editor } from "@tandem/editor/models";
import { SelectAction } from "@tandem/editor/actions";
import { FrontEndApplication } from "@tandem/editor/application";
import { SelectablesComponent } from "@tandem/editor/components/selectables";
import { SyntheticDOMElement } from "@tandem/synthetic-browser";
import { IVisibleEntity, IEntity } from "@tandem/common/lang/entities";
import { ReactComponentFactoryDependency } from "@tandem/editor/dependencies";

// @injectable
export default class SelectableToolComponent extends React.Component<{selection: any, allEntities: Array<IEntity>, bus: any, app: any, zoom: number, editor: Editor }, {}>  {

  onSyntheticMouseDown = (element: SyntheticDOMElement, event: MouseEvent) => {
    this.props.app.bus.execute(new SelectAction(element, event.shiftKey));
  }

  render() {
    return <SelectablesComponent {...this.props} onSyntheticMouseDown={this.onSyntheticMouseDown} />;
  }
}

export const selectableToolComponentDependency = new ReactComponentFactoryDependency("components/tools/pointer/selectable", SelectableToolComponent);
