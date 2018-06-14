/**
 * preview of all components & artboards
 */

import "./index.scss";
import * as React from "react";
import { compose, pure } from "recompose";
import { DocumentPreviewComponent } from "./document";
import {
  Frame,
  Dependency,
  SyntheticDocument,
  getSyntheticDocumentById,
  getSyntheticNodeById
} from "paperclip";

export type PreviewLayerOuterProps = {
  frames: Frame[];
  documents: SyntheticDocument[];
  dependency: Dependency<any>;
};

const BasePreviewLayerComponent = ({
  frames,
  dependency,
  documents
}: PreviewLayerOuterProps) => (
  <div className="m-preview-layer">
    {frames.map(frame => (
      <DocumentPreviewComponent
        key={frame.contentNodeId}
        contentNode={getSyntheticNodeById(frame.contentNodeId, documents)}
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
