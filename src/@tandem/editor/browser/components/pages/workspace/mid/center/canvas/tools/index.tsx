import "./index.scss";
import React =  require("React");
import { Workspace } from "@tandem/editor/browser/stores";
import { SyntheticDOMElement } from "@tandem/synthetic-browser";
import { RegisteredComponent } from "@tandem/editor/browser/components/common";
import { BaseApplicationComponent } from "@tandem/common";


export default class ToolsComponent extends BaseApplicationComponent<{ workspace: Workspace, zoom: number, zooming: boolean, allElements: SyntheticDOMElement[] }, any> {
  render() {
    return (<div className="m-stage-tools">
      <RegisteredComponent ns="components/tools/**" workspace={this.props.workspace} zoom={this.props.zoom} zooming={this.props.zooming} allElements={this.props.allElements} selection={[]} />
    </div>);
  }
}
