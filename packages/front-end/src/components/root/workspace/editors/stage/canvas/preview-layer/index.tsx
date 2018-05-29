/**
 * preview of all components & artboards
 */

import "./index.scss";
import * as React from "react";
import { EMPTY_ARRAY } from "tandem-common";
import { SyntheticFrame, Dependency } from "paperclip";
import { DocumentPreviewComponent } from "./document";
import { compose, pure, withHandlers, lifecycle } from "recompose";

export type PreviewLayerOuterProps = {
  frames: SyntheticFrame[];
  dependency: Dependency<any>;
};

const BasePreviewLayerComponent = ({
  frames,
  dependency
}: PreviewLayerOuterProps) => (
  <div className="m-preview-layer">
    {frames.map(frame => (
      <DocumentPreviewComponent
        key={frame.source.nodeId}
        frame={frame}
        dependency={dependency}
      />
    ))}
  </div>
);

export const PreviewLayerComponent = compose<
  PreviewLayerOuterProps,
  PreviewLayerOuterProps
>(pure)(BasePreviewLayerComponent);
