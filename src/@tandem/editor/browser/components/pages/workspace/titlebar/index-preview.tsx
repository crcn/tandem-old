
import "reflect-metadata";
import "@tandem/uikit/scss";
import { reactEditorPreview } from "@tandem/editor/browser/preview";
import React =  require("react");
import ReactDOM = require("react-dom");
import { WorkspaceTitlebarComponent } from "./index";

export const createBodyElement = reactEditorPreview(() => {
  return <WorkspaceTitlebarComponent />;
});
        
        