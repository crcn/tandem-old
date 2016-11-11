import * as React from "react";
import { reactEditorPreview } from "@tandem/editor/browser/preview";
import { Workspace } from "@tandem/editor/browser/models";
import { GutterComponent } from "@tandem/editor/browser/components";
import { LayersPaneComponent } from "./index";
import { SyntheticWindow } from "@tandem/synthetic-browser";

export const renderPreview = reactEditorPreview(() => {
  const { document } = new SyntheticWindow(null);

  document.body.innerHTML = `
    <div class="test">
      <!-- comment me this -->
      <ul id="list" class="some class">
        <li>Item</li>
        <li>Item 2</li>
        <li>Item 3</li>
      </ul>
    </div>
  `;

  return <GutterComponent>
    <LayersPaneComponent workspace={{ document } as any} />
  </GutterComponent>
});