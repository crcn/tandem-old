import * as React from "react";
import { hydrateTdArtboardsPane, TdArtboardsPaneInnerProps, hydrateTdArtboardsPaneRow, TdArtboardsPaneRowInnerProps } from "./artboards-pane.pc";
import { Workspace, Artboard, getArtboardLabel } from "front-end/state";
import { artboardPaneRowClicked } from "front-end/actions";
import { compose, pure, withHandlers, withProps } from "recompose";

const ArtboardsPaneRow = hydrateTdArtboardsPaneRow(
  compose<TdArtboardsPaneRowInnerProps, TdArtboardsPaneRowInnerProps>(
    pure,
    withHandlers({
      onClick: ({ onClick, $id }) => (event) => {
        onClick(event, $id);
      }
    })
  ),
  {
    TdSpinner: null
  }
);

export type ArtboardsPaneOuterProps = {
  dispatch: any;
  artboards: Artboard[];
  workspace: Workspace;
};


export type ArtboardsPaneInnerProps = {
  onArtboardClicked: any;
} & ArtboardsPaneOuterProps;

export const ArtboardsPane = hydrateTdArtboardsPane(
  compose<TdArtboardsPaneInnerProps, ArtboardsPaneOuterProps>(
    pure,
    withHandlers({
      onArtboardClicked: ({dispatch}) => (event, windowId) => {
        dispatch(artboardPaneRowClicked(windowId, event));
      }
    }),
    (Base: React.ComponentClass<TdArtboardsPaneInnerProps>) => ({ workspace, artboards, onArtboardClicked }: ArtboardsPaneInnerProps) => {
      const artboardProps = artboards.map(artboard => ({
        ...artboard,
        label: getArtboardLabel(artboard),
        selected: workspace.selectionRefs.find(([$type, $id]) => $id === artboard.$id)
      }));

      return <Base artboards={artboardProps} onArtboardClicked={onArtboardClicked}  />
    }
  ),
  {
    TdListItem: null,
    TdArtboardsPaneRow: ArtboardsPaneRow,
    TdList: null
  }
);