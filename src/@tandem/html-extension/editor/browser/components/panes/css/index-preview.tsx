
import * as React from "react";
import { reactEditorPreview } from "@tandem/editor/browser/preview";
import { Workspace } from "@tandem/editor/browser/models";
import { GutterComponent } from "@tandem/editor/browser/components";
import { ElementCSSPaneComponent } from "./index";
import {
  parseCSS,
  evaluateCSS,
  SyntheticWindow,
  SyntheticHTMLElement,
  SyntheticCSSStyleRule,
} from "@tandem/synthetic-browser";


export const renderPreview = reactEditorPreview(() => {
  const { document } = new SyntheticWindow(null);

  document.styleSheets.push(evaluateCSS(parseCSS(`
    .container {
      color: red;
      background: rgba(255, 255, 255, 0);
      box-sizing: border-box;
      padding-right: border-box;
    }

    div {
      color: red;
    }

    #something {

    }
  `)));

  (document.body as SyntheticHTMLElement).innerHTML = `
    <div id="something" class="container">hello</div>;
  `;

  const workspace = new Workspace();
  workspace.select(document.querySelector(".container"));

  return <GutterComponent>
    <ElementCSSPaneComponent workspace={workspace} />
  </GutterComponent>
});