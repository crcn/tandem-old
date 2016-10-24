import * as cx from "classnames";
import * as React from "react";
import { Workspace } from "@tandem/editor/models";
import { SelectAction } from "@tandem/editor/actions";
import { FrontEndApplication } from "@tandem/editor/application";
import { SelectablesComponent } from "@tandem/editor/components/common";
import { StageToolComponentFactoryDependency } from "@tandem/editor/dependencies";
import { SyntheticHTMLElement, SyntheticDOMElement } from "@tandem/synthetic-browser";

export default class SelectableToolComponent extends React.Component<{selection: any,  allElements: SyntheticDOMElement[], bus: any, app: any, zoom: number, workspace: Workspace }, {}>  {

  onSyntheticMouseDown = (element: SyntheticHTMLElement, event: React.MouseEvent) => {
    this.props.app.bus.execute(new SelectAction(element, event.shiftKey));
  }

  render() {
    return <SelectablesComponent {...this.props} onSyntheticMouseDown={this.onSyntheticMouseDown} />;
  }
}

export const selectableToolComponentDependency = new StageToolComponentFactoryDependency("selectable", "pointer", SelectableToolComponent);
