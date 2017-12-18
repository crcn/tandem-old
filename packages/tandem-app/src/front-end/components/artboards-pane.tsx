import * as React from "react";
import { hydrateTdArtboardsPane, TdArtboardsPaneInnerProps, hydrateTdArtboardsPaneRow, TdArtboardsPaneRowInnerProps } from "./artboards-pane.pc";
import { Workspace, Artboard } from "front-end/state";
import { windowPaneRowClicked } from "front-end/actions";
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
  {}
);

export type ArtboardsPaneOuterProps = {
  dispatch: any;
  artboards: Artboard[];
  workspace: Workspace;
};


export type ArtboardsPaneInnerProps = {
  onWindowClicked: any;
} & ArtboardsPaneOuterProps;

export const ArtboardsPane = hydrateTdArtboardsPane(
  compose<TdArtboardsPaneInnerProps, ArtboardsPaneOuterProps>(
    pure,
    withHandlers({
      onWindowClicked: ({dispatch}) => (event, windowId) => {
        dispatch(windowPaneRowClicked(windowId, event));
      }
    }),
    (Base: React.ComponentClass<TdArtboardsPaneInnerProps>) => ({ workspace, artboards, onWindowClicked }: ArtboardsPaneInnerProps) => {
      const artboardProps = artboards.map(window => ({
        ...window,
        selected: workspace.selectionRefs.find(([$type, $id]) => $id === window.$id)
      }));

      return <Base artboards={artboardProps} onWindowClicked={onWindowClicked}  />
    }
  ),
  {
    TdListItem: null,
    TdArtboardsPaneRow: ArtboardsPaneRow,
    TdList: null,
    TdPane: null
  }
);