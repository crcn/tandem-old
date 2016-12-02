import "@tandem/uikit/scss";
import "reflect-metadata";
import { reactEditorPreview } from "@tandem/editor/browser/preview";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { WelcomeComponent } from "./index";

export const renderPreview = reactEditorPreview(() => {
  return <WelcomeComponent />;
});
        
        