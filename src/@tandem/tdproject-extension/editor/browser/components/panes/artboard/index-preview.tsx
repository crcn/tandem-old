
import "reflect-metadata";
import "@tandem/uikit/scss";
import { reactEditorPreview } from "@tandem/editor/browser/preview";
import React =  require("React");
import ReactDOM = require("react-dom");
import { ArtboardPaneComponent } from "./index";
import { Workspace } from "@tandem/editor/browser/stores";
import { SyntheticWindow } from "@tandem/synthetic-browser";
import { GutterComponent } from "@tandem/uikit";
import { SyntheticTDArtboardElement } from "@tandem/tdproject-extension/synthetic";

export const createBodyElement = reactEditorPreview(() => {
  const workspace = new Workspace();
  const { document } = new SyntheticWindow();
  document.registerElement("artboard", SyntheticTDArtboardElement);
  document.body.innerHTML = `
    <artboard style="width:100px;height:100px;" />
  `;


  workspace.select(document.querySelector("artboard"));

  return <div className="td-workspace flex">
    <GutterComponent>
      <ArtboardPaneComponent workspace={workspace} />
    </GutterComponent>
  </div>;
});
        
        