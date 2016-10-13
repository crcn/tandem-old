import * as cx from "classnames";
import * as React from "react";
import { Editor } from "@tandem/editor/models";
import { SelectAction } from "@tandem/editor/actions";
import { FrontEndApplication } from "@tandem/editor/application";
import { SelectablesComponent } from "../selectables";
import { BaseVisibleDOMNodeEntity } from "@tandem/synthetic-browser";
import { ReactComponentFactoryDependency } from "@tandem/editor/dependencies";

// @injectable
export default class SelectableToolComponent extends React.Component<{selection: any,  bus: any, app: any, zoom: number, editor: Editor }, {}>  {

  onSyntheticMouseDown = (entity: BaseVisibleDOMNodeEntity<any, any>, event: React.MouseEvent) => {
    this.props.app.bus.execute(new SelectAction(entity, event.shiftKey));
  }

  render() {
    return <SelectablesComponent {...this.props} onSyntheticMouseDown={this.onSyntheticMouseDown} />;
  }
}

export const selectableToolComponentDependency = new ReactComponentFactoryDependency("components/tools/pointer/selectable", SelectableToolComponent);
