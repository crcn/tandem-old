import "./index.scss";

import * as React from "react";
import CenterComponent from "./center";
import { DocumentGutterComponent } from "./document-sidebar";
import { SelectionGutterComponent } from "./selection-sidebar";
import { IActor, Injector, RootApplicationComponent } from "@tandem/common";


export class RootEditorComponent extends RootApplicationComponent {
  render() {
    return <div className="m-editor editor">
      <DocumentGutterComponent />
      <CenterComponent />
      <SelectionGutterComponent />
    </div>;
  }
}

