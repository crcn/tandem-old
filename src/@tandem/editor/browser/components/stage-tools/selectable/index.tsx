import cx =  require("classnames");
import React =  require("react");
import { Workspace } from "@tandem/editor/browser/stores";
import { SelectRequest } from "@tandem/editor/browser/messages";
import { SelectablesComponent } from "@tandem/editor/browser/components/common";
import { StageToolComponentFactoryProvider } from "@tandem/editor/browser/providers";
import { SyntheticHTMLElement, SyntheticDOMElement } from "@tandem/synthetic-browser";

export class SelectableStageToolComponent extends React.Component<{selection: any, zooming: boolean, allElements: SyntheticDOMElement[], bus: any, app: any, zoom: number, workspace: Workspace }, {}>  {

  onSyntheticMouseDown = (element: SyntheticHTMLElement, event: React.MouseEvent<any>) => {
    this.props.workspace.select(element, event.shiftKey);
  }

  render() {
    return <SelectablesComponent allElements={this.props.allElements} zoom={this.props.zoom} workspace={this.props.workspace} show={!this.props.zooming && this.props.workspace.showStageTools} onSyntheticMouseDown={this.onSyntheticMouseDown} />;
  }
}

