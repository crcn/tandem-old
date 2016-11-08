import { reactEditorPreview } from "@tandem/editor/browser/preview";


import * as React from "react";
import { Workspace } from "@tandem/editor/browser/models";
import { GutterComponent } from "@tandem/editor/browser/components";
import { ElementCSSPaneComponent, CSSStylePaneComponent } from "./index";
import {
  parseCSS,
  evaluateCSS,
  SyntheticWindow,
  SyntheticHTMLElement,
  SyntheticCSSStyleRule,
  SyntheticCSSStyleDeclaration,
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
      color: blue;
    }
  `)));

  (document.body as SyntheticHTMLElement).innerHTML = `
    <div id="something" class="container">hello</div>;
  `;

  const workspace = new Workspace();
  workspace.select(document.querySelector(".container"));

  const style = SyntheticCSSStyleDeclaration.fromObject({
    backgroundColor: "red",
    color: "blue"
  });

  return <GutterComponent>
    <ElementCSSPaneComponent workspace={workspace} />
    <CSSStylePaneComponent style={style} title="pretty pane" titleClassName="color-green-10" pretty={true} setDeclaration={() => {}} />
  </GutterComponent>
});