

import "reflect-metadata";
import "@tandem/uikit/scss";
import { reactEditorPreview } from "@tandem/editor/browser/preview";
import * as React from "react";
import * as ReactDOM from "react-dom";
import  FooterComponent from "./index";
import { Workspace } from "@tandem/editor/browser/stores";
import { MetadataKeys } from "@tandem/editor/browser/constants";
import { SyntheticWindow } from "@tandem/synthetic-browser";

export const createBodyElement = reactEditorPreview(() => {

  const { document } = new SyntheticWindow();

  document.body.innerHTML = `
    <div class="container">
      <div class="body">
        <ul id="items">
          <li>Item</li>
          <li>Item</li>
          <li>Item</li>
          <li id="last-item">Item</li>
        </ul>
      </div>
    </div>
  `;


  document.body.querySelector("body").metadata.set(MetadataKeys.HOVERING, true);

  const workspace = new Workspace();
  workspace.select(document.querySelector("#last-item"));
  
  return <FooterComponent workspace={workspace} />;
});
        
        