import { reactEditorPreview } from "@tandem/editor/browser/preview";


import * as React from "react";
import { Workspace } from "@tandem/editor/browser/models";
import { GutterComponent } from "@tandem/uikit";
import { ElementCSSPaneComponent, CSSStylePaneComponent } from "./index";
import {
  parseCSS,
  evaluateCSS,
  SyntheticWindow,
  SyntheticHTMLElement,
  SyntheticCSSElementStyleRule,
  SyntheticCSSStyle,
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

    span {
      letter-spacing: 0.01em;
      color: red;
      display: block;
    }
  `)));

  document.styleSheets[0].rules[0].$source = {
    kind: null,
    filePath: "some/file/super/long/file/path/that/should/not/wrap/path.css",
    start: {
      line: 0,
      column: 0
    }
  };

  (document.body as SyntheticHTMLElement).innerHTML = `
    <span><div id="something" class="container">hello</div></span>;
  `;

  const workspace = new Workspace();
  workspace.select(document.querySelector(".container"));

  const style = SyntheticCSSStyle.fromObject({
    backgroundColor: "red",
    color: "blue"
  });
    // <CSSStylePaneComponent style={style} title="pretty pane" titleClassName="color-green-10" pretty={true} setDeclaration={() => {}} />

  return <GutterComponent>
    <ElementCSSPaneComponent workspace={workspace} />
  </GutterComponent>
});