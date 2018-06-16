import "./index.scss";
import * as React from "react";
import { compose, pure, lifecycle, withHandlers } from "recompose";
import { Resizer } from "./resizer";
// import { SelectionLabel } from "./label";
// import { Dispatcher, mergeBounds, Bounded, wrapEventToDispatch } from "aerial-common2";
// import { Workspace, getBoundedWorkspaceSelection, getWorkspaceItemBounds } from "front-end/state";
// import { selectorDoubleClicked } from "front-end/actions";
import { Dispatch } from "redux";
import { mergeBounds } from "tandem-common";
import {
  RootState,
  getBoundedSelection,
  EditorWindow,
  getSelectionBounds,
  Canvas
} from "../../../../../../../../../state";
import { selectorDoubleClicked } from "../../../../../../../../../actions";
import { getSyntheticVisibleNodeRelativeBounds } from "paperclip";

export type SelectionOuterProps = {
  canvas: Canvas;
  dispatch: Dispatch<any>;
  zoom: number;
  root: RootState;
  editorWindow: EditorWindow;
};

export type SelectionInnerProps = {
  setSelectionElement(element: HTMLDivElement);
  onDoubleClick(event: React.MouseEvent<any>);
} & SelectionOuterProps;

const SelectionBounds = ({
  editorWindow,
  root,
  zoom
}: {
  root: RootState;
  zoom: number;
  editorWindow: EditorWindow;
}) => {
  const selection = getBoundedSelection(root);
  const entireBounds = getSelectionBounds(root);
  const style = {};
  const borderWidth = 1 / zoom;
  const boundsStyle = {
    position: "absolute",
    top: entireBounds.top,
    left: entireBounds.left,

    // round bounds so that they match up with the NWSE resizer
    width: entireBounds.right - entireBounds.left,
    height: entireBounds.bottom - entireBounds.top,
    boxShadow: `inset 0 0 0 ${borderWidth}px #00B5FF`
  };

  return <div style={boundsStyle as any} />;
};

export const SelectionCanvasToolBase = ({
  canvas,
  editorWindow,
  root,
  dispatch,
  onDoubleClick,
  zoom
}: SelectionInnerProps) => {
  const selection = getBoundedSelection(root);
  if (!selection.length || editorWindow.secondarySelection) return null;

  return (
    <div className="m-stage-selection-tool" onDoubleClick={onDoubleClick}>
      <SelectionBounds root={root} zoom={zoom} editorWindow={editorWindow} />
      <Resizer
        root={root}
        editorWindow={editorWindow}
        canvas={canvas}
        dispatch={dispatch}
        zoom={zoom}
      />
    </div>
  );
};

const enhanceSelectionCanvasTool = compose<
  SelectionInnerProps,
  SelectionOuterProps
>(
  pure,
  withHandlers({
    onDoubleClick: ({ dispatch, root }: SelectionInnerProps) => (
      event: React.MouseEvent<any>
    ) => {
      const selection = getBoundedSelection(root);
      if (selection.length === 1) {
        dispatch(selectorDoubleClicked(selection[0], event));
      }
    }
  })
);

export const SelectionCanvasTool = enhanceSelectionCanvasTool(
  SelectionCanvasToolBase
);

export * from "./resizer";
