import * as React from "react";
import { reactEditorPreview } from "@tandem/editor/browser/preview";
import { GutterComponent } from "@tandem/editor/browser/components";
import { NavigatorPaneComponent } from "./index";

export const renderPreview = reactEditorPreview(() => {
  return <GutterComponent>
    <NavigatorPaneComponent />
  </GutterComponent>
});

