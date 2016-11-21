import * as React from "react";
import { GutterComponent } from "@tandem/uikit";
import { Workspace } from "@tandem/editor/browser/models";
import { reactEditorPreview } from "@tandem/editor/browser/preview";
import { SyntheticWindow } from "@tandem/synthetic-browser";
import {
  LayersPaneComponent,
  ElementCSSPaneComponent,
  HTMLStylePaneComponent,
  ElementAttributesPaneComponent,
} from "@tandem/html-extension/editor/browser/components";

export const renderPreview = reactEditorPreview(() => {

  const { document } = new SyntheticWindow();

  document.body.innerHTML = `
    <style>
      .container {

      }
    </style>
    <div class="container">
    </div>
  `;

  const workspace = new Workspace();
  workspace.select([document.querySelector(".container")]);

  return <div>
    <GutterComponent>
      <LayersPaneComponent workspace={workspace} />
    </GutterComponent>
    <div>
      center
    </div>
    <GutterComponent>
      <ElementAttributesPaneComponent workspace={workspace} />
      <HTMLStylePaneComponent workspace={workspace} />
      <ElementCSSPaneComponent workspace={workspace} />
    </GutterComponent>
  </div>
});