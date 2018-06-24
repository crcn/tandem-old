import * as React from "react";
import * as path from "path";
import { pure, compose } from "recompose";
import { FrameLayersComponent } from "./pc";
import { RootState, OpenFile } from "../../../../../../state";
import {
  getFramesByDependencyUri,
  getSyntheticDocumentByDependencyUri,
  PAPERCLIP_DEFAULT_EXTENSIONS
} from "paperclip";
import { Dispatch } from "redux";

type LayersOuterProps = {
  dispatch: Dispatch<any>;
  root: RootState;
  uri: string;
};

type LayersInnerProps = {} & LayersOuterProps;

export const BaseLayersComponent = ({
  dispatch,
  root,
  uri
}: LayersOuterProps) => {
  const ext = path.extname(uri);

  // only PC for now. Ideally this may also support images, and other visual documents.
  return (
    <div className="m-open-file-layers">
      {ext === PAPERCLIP_DEFAULT_EXTENSIONS[0] ? (
        <FrameLayersComponent
          selectedReferences={root.selectedNodeIds}
          hoveringNodeIds={root.hoveringNodeIds}
          dispatch={dispatch}
          document={getSyntheticDocumentByDependencyUri(
            uri,
            root.documents,
            root.graph
          )}
          frames={getFramesByDependencyUri(
            uri,
            root.frames,
            root.documents,
            root.graph
          )}
        />
      ) : null}
    </div>
  );
};

export const LayersComponent = compose<LayersInnerProps, LayersOuterProps>(
  pure
)(BaseLayersComponent);
