import { reactEditorPreview } from "@tandem/editor/browser/preview";
import * as React from "react";
import {  GutterComponent } from "@tandem/uikit";
import { Workspace } from "@tandem/editor/browser";
import { HTMLStylePaneComponent } from "./index";
import { SyntheticWindow, SyntheticHTMLElement } from "@tandem/synthetic-browser";

export const renderPreview = reactEditorPreview(() => {
  const ws = new Workspace();

  const { document } = new SyntheticWindow(null);

  (document.body as SyntheticHTMLElement).innerHTML = `
    <div style="color:red; background: rgba(255, 255, 255, 0); font-family: Awesome"></div>;
  `;

  ws.select(document.body.firstChild);

  return <GutterComponent>
    <HTMLStylePaneComponent  workspace={ws} />
  </GutterComponent>
});