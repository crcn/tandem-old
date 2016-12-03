import "@tandem/uikit/scss";
import "reflect-metadata";
import { reactEditorPreview } from "@tandem/editor/browser/preview";
import { TandemStudioBrowserStore } from "tandem-studio/browser/stores";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { WelcomeComponent } from "./index";

export const renderPreview = reactEditorPreview(() => {
  const store = new  TandemStudioBrowserStore();
  store.projectStarterOptions = [];
  return <WelcomeComponent store={store} />;
});
        
        