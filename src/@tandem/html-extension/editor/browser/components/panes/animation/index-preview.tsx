import * as React from "react";
import { reactEditorPreview } from "@tandem/editor/browser/preview";
import { GutterComponent } from "@tandem/editor/browser";
import { CSSAnimationComponent } from "./index";

export const renderPreview = reactEditorPreview(() => {
  return <GutterComponent>
    <CSSAnimationComponent />
  </GutterComponent>;
});