import React = require("react");
import { BaseApplicationComponent } from "@tandem/common";
import { ExecuteCommandRequest } from "tandem-code/common";

export class BugButtonComponent extends BaseApplicationComponent<any, any> {

  open = (event: React.MouseEvent<any>) => {
    event.preventDefault();
    ExecuteCommandRequest.dispatch(`open https://github.com/tandemcode/support/issues/new`, this.bus);
  }
  render() {
      return <a href="#" style={{ marginRight: 8 }} className="pull-right" onClick={this.open}><i className="ion-bug" /></a>
  }
}