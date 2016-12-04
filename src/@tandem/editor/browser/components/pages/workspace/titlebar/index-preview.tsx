
import "reflect-metadata";
import "@tandem/uikit/scss";
import { reactEditorPreview } from "@tandem/editor/browser/preview";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { WorkspaceTitlebarComponent } from "./index";

export const createBodyElement = reactEditorPreview(() => {
  return <WorkspaceTitlebarComponent />;
});
        
        