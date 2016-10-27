import * as cx from "classnames";
import * as React from "react";
import { Workspace } from "@tandem/editor/browser/models";
import { SelectAction } from "@tandem/editor/browser/actions";
import { FrontEndApplication } from "@tandem/editor/browser/application";
import { SelectablesComponent } from "@tandem/editor/browser/components/common";
import { StageToolComponentFactoryDependency } from "@tandem/editor/browser/dependencies";
import { SyntheticHTMLElement, SyntheticDOMElement } from "@tandem/synthetic-browser";

export class SelectableStageToolComponent extends React.Component<{selection: any, zooming: boolean, allElements: SyntheticDOMElement[], bus: any, app: any, zoom: number, workspace: Workspace }, {}>  {

  onSyntheticMouseDown = (element: SyntheticHTMLElement, event: React.MouseEvent<any>) => {
    this.props.workspace.select(element, event.shiftKey);
  }

  render() {
    return <SelectablesComponent {...this.props} onSyntheticMouseDown={this.onSyntheticMouseDown} zooming={this.props.zooming} />;
  }
}

