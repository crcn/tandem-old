import * as React from "react";
import * as path from "path";
import { pure, compose } from "recompose";
import { SyntheticWindowLayersComponent } from "./pc";
import { RootState, OpenFile } from "../../../../../../state";
import { getSyntheticWindow } from "paperclip";
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
      {ext === ".pc" ? (
        <SyntheticWindowLayersComponent
          selectedReferences={root.selectedNodeIds}
          hoveringNodeIds={root.hoveringNodeIds}
          dispatch={dispatch}
          window={getSyntheticWindow(uri, root.browser)}
          browser={root.browser}
        />
      ) : null}
    </div>
  );
};

export const LayersComponent = compose<LayersInnerProps, LayersOuterProps>(
  pure
)(BaseLayersComponent);
