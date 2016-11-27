import "@tandem/uikit/scss";
import "reflect-metatadata";
import { reactEditorPreview } from "@tandem/editor/browser/preview";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { BoundingRect } from "@tandem/common";
import { ElementInfoStageToolComponent } from "./index";
import { SyntheticWindow, SyntheticCSSStyle } from "@tandem/synthetic-browser";
import { Workspace  } from "@tandem/editor/browser/models";
import { MetadataKeys  } from "@tandem/editor/browser/constants";

export const renderPreview = reactEditorPreview(() => {
  const { document } = new SyntheticWindow();

  const workspace = new Workspace();

  const container = document.createElement("div");
  container.setAttribute("id", "id");
  container.setAttribute("class", "container box");

  container.getBoundingClientRect = () => {
    return new  BoundingRect(50, 50, 150, 150);
  };

  container.getComputedStyle = () => {
    return SyntheticCSSStyle.fromObject({
      paddingLeft: "10px",
      paddingRight: "10px"
    })
  }

  container.metadata.set(MetadataKeys.HOVERING, true);


  const allElements = [container];

  return <ElementInfoStageToolComponent allElements={allElements} workspace={workspace} />;
});
        