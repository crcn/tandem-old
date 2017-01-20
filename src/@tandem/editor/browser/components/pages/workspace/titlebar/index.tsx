import "./index.scss";
import cx =  require("classnames");
import React =  require("react");
import CheckboxComponent = require("rc-checkbox");
import { RegisteredComponent } from "@tandem/editor/browser/components/common";
import { BaseApplicationComponent } from "@tandem/common";
import { HeaderComponentFactoryProvider } from "@tandem/editor/browser/providers";


export class WorkspaceTitlebarComponent extends BaseApplicationComponent<any, any> {
  render() {
    return <div className="td-workspace-titlebar">
      &nbsp;
      <RegisteredComponent ns={HeaderComponentFactoryProvider.getId("**")} />
    </div>;
  }
}