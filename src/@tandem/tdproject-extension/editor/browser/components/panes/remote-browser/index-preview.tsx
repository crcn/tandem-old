
import "reflect-metadata";
import "@tandem/uikit/scss";
import { reactEditorPreview } from "@tandem/editor/browser/preview";
import React =  require("react");
import ReactDOM = require("react-dom");
import { RemoteBrowserPaneComponent } from "./index";
import { Workspace } from "@tandem/editor/browser/stores";
import { SyntheticWindow } from "@tandem/synthetic-browser";
import { GutterComponent } from "@tandem/uikit";
import { SyntheticRemoteBrowserElement } from "@tandem/tdproject-extension/synthetic";

export const createBodyElement = reactEditorPreview(() => {
  const workspace = new Workspace();
  const { document } = new SyntheticWindow();
  document.registerElement("remote-browser", SyntheticRemoteBrowserElement);
  document.body.innerHTML = `
    <remote-browser style="width:100px;height:100px;" />
  `;


  workspace.select(document.querySelector("remote-browser"));

  return <div className="td-workspace flex">
    <GutterComponent>
      <RemoteBrowserPaneComponent workspace={workspace} />
    </GutterComponent>
  </div>;
});
        
        