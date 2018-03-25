/**
 * preview of all components & artboards
 */

import "./index.scss";
import * as React from "react";
import { EMPTY_ARRAY } from "common";
import { SyntheticWindow } from "paperclip";
import { DocumentPreviewComponent } from "./document";
import { compose, pure, withHandlers, lifecycle } from "recompose";

export type PreviewLayerOuterProps = {
  window: SyntheticWindow;
};

const BasePreviewLayerComponent = ({ window }: PreviewLayerOuterProps) => <div className="m-preview-layer">
  { (window && window.documents || EMPTY_ARRAY).map(document => <DocumentPreviewComponent document={document} />)}
</div>; 


export const PreviewLayerComponent = compose<PreviewLayerOuterProps, PreviewLayerOuterProps>(pure)(BasePreviewLayerComponent);