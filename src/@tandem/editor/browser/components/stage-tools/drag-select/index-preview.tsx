
import "reflect-metadata";
import "@tandem/uikit/scss";
import { Workspace } from "@tandem/editor/browser/stores";
import { reactEditorPreview } from "@tandem/editor/browser/preview";
import React =  require("react");
import ReactDOM = require("react-dom");
import { DragSelectStageToolComponent } from "./index";

export const createBodyElement = reactEditorPreview(() => {
  const workspace = new Workspace();
  
  return <div>
    <DragSelectStageToolComponent workspace={workspace} style={{ left: 100, top: 100, width: 300, height: 200 }} />
    <div style={{ position: "absolute", left: 80, top: 120, background: "#666", color: "white", padding: 20 }}>
      I'm being selected
    </div>
  </div>
});
        
        