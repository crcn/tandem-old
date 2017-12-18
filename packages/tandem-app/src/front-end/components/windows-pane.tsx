import * as React from "react";
import { hydrateTdWindowsPane, TdWindowsPaneInnerProps, hydrateTdWindowsPaneRow, TdWindowsPaneRowInnerProps } from "./windows-pane.pc";
import { Workspace } from "front-end/state";
import { SyntheticWindow } from "aerial-browser-sandbox";
import { ArtboardPaneRowClicked } from "front-end/actions";
import { compose, pure, withHandlers, withProps } from "recompose";

const WindowsPaneRow = hydrateTdWindowsPaneRow(
  compose<TdWindowsPaneRowInnerProps, TdWindowsPaneRowInnerProps>(
    pure,
    withHandlers({
      onClick: ({ onClick, $id }) => (event) => {
        onClick(event, $id);
      }
    })
  ),
  {}
);

export type WindowsPaneOuterProps = {
  dispatch: any;
  windows: SyntheticWindow[];
  workspace: Workspace;
};


export type WindowsPaneInnerProps = {
  onWindowClicked: any;
} & WindowsPaneOuterProps;

export const WindowsPane = hydrateTdWindowsPane(
  compose<TdWindowsPaneInnerProps, WindowsPaneOuterProps>(
    pure,
    withHandlers({
      onWindowClicked: ({dispatch}) => (event, windowId) => {
        // dispatch(ArtboardPaneRowClicked(windowId, event));
      }
    }),
    (Base: React.ComponentClass<TdWindowsPaneInnerProps>) => ({ workspace, windows, onWindowClicked }: WindowsPaneInnerProps) => {
      const windowProps = windows.map(window => ({
        ...window,
        selected: workspace.selectionRefs.find(([$type, $id]) => $id === window.$id)
      }));

      return <Base windows={windowProps} onWindowClicked={onWindowClicked}  />
    }
  ),
  {
    TdListItem: null,
    TdWindowsPaneRow: WindowsPaneRow,
    TdList: null,
    TdPane: null
  }
);