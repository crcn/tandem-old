import { reactEditorPreview } from "@tandem/editor/browser/preview";

import * as React from "react";
import { DOMElements } from "@tandem/html-extension/collections";
import { FocusComponent } from "@tandem/editor/browser/components/common";
import { reactPreview, Metadata } from "@tandem/common";
import { Workspace, GutterComponent } from "@tandem/editor/browser";
import { HashInputComponent } from "@tandem/html-extension/editor/browser/components/common";
import { EntityAttributesPaneComponent } from "./index";
import {
  SyntheticWindow,
  SyntheticLocation,
  SyntheticHTMLElement,
  SyntheticDOMAttribute,
} from "@tandem/synthetic-browser";

export const renderPreview = reactEditorPreview(() => {
  const workspace = new Workspace();
  const window = new SyntheticWindow(new SyntheticLocation("test"));
  (window.document.body as SyntheticHTMLElement).innerHTML = `
    <div class="test" id="some id" a-very-long-attribute="something" />
  `;
  workspace.select(window.document.body.firstChild);
  return <GutterComponent>
    <EntityAttributesPaneComponent workspace={workspace} />
  </GutterComponent>
})