import * as React from "react";
import { reactEditorPreview } from "@tandem/editor/browser/preview";
import { Workspace } from "@tandem/editor/browser/models";
import { MetadataKeys } from "@tandem/editor/browser/constants";
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

  document.body.firstChild.metadata.set(MetadataKeys.LAYER_EXPANDED, true);
  document.querySelector("ul").metadata.set(MetadataKeys.LAYER_EXPANDED, true);
  document.querySelector("div").metadata.set(MetadataKeys.HOVERING, true);

  return <GutterComponent>
    <LayersPaneComponent workspace={{ document, selection: [document.querySelector("li")] } as any} />
  </GutterComponent>
});