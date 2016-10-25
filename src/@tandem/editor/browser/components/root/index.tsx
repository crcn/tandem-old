import "./index.scss";

import * as React from "react";
import CenterComponent from "./center";
import { IActor, Dependencies } from "@tandem/common";
import { DocumentGutterComponent } from "./document-sidebar";
import { SelectionGutterComponent } from "./selection-sidebar";

interface IRootEditorComponentProps {
  app?: any;
  bus: IActor;
  dependencies: Dependencies;
}

export class RootEditorComponent extends React.Component<IRootEditorComponentProps, {}> {

  static childContextTypes = {
    bus: React.PropTypes.object.isRequired,
    dependencies: React.PropTypes.object.isRequired
  };

  getChildContext() {
    return this.props;
  }

  render() {
    return (<div className="m-editor editor">
      <DocumentGutterComponent />
      <CenterComponent />
      <SelectionGutterComponent />
    </div>);
  }
}

