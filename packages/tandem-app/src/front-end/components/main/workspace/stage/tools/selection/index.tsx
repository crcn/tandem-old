import "./index.scss";
import * as React from "react";
import { compose, pure, lifecycle, withHandlers } from "recompose";
import { Resizer } from "./resizer";
import { SelectionLabel } from "./label";
import { SyntheticBrowser } from "aerial-browser-sandbox";
import { Dispatcher, mergeBounds, Bounded, wrapEventToDispatch } from "aerial-common2";
import { Workspace, getBoundedWorkspaceSelection, getSyntheticBrowserItemBounds, getWorkspaceItemBounds } from "front-end/state";
import { selectorDoubleClicked } from "front-end/actions";

export type SelectionOuterProps = {
  workspace: Workspace;
  dispatch: Dispatcher<any>;
  zoom: number;
}

export type SelectionInnerProps = {
  setSelectionElement(element: HTMLDivElement);
  onDoubleClick(event: React.MouseEvent<any>);
} & SelectionOuterProps;

const  SelectionBounds = ({ workspace, zoom }: { workspace: Workspace, zoom: number }) => {
  const selection = getBoundedWorkspaceSelection(workspace);
  const entireBounds = mergeBounds(...selection.map(value => getWorkspaceItemBounds(value, workspace)));
  const style = {};
  const borderWidth = 1 / zoom;
  const boundsStyle = {
    position: "absolute",
    top: entireBounds.top,
    left: entireBounds.left,
    width: entireBounds.right - entireBounds.left,
    height: entireBounds.bottom - entireBounds.top,
    boxShadow: `inset 0 0 0 ${borderWidth}px #00B5FF`
  };

  return <div style={boundsStyle as any}></div>;
};

export const  SelectionStageToolBase = ({ workspace, dispatch, onDoubleClick, zoom }: SelectionInnerProps) => {
  const selection = getBoundedWorkspaceSelection(workspace);    
  if (!selection.length || workspace.stage.secondarySelection) return null;

  return <div className="m-stage-selection-tool" tabIndex={-1} onDoubleClick={onDoubleClick}>
    <SelectionBounds workspace={workspace} zoom={zoom} />
    <Resizer workspace={workspace} dispatch={dispatch} zoom={zoom} />
  </div>;
};

const enhanceSelectionStageTool = compose<SelectionInnerProps, SelectionOuterProps>(
  pure,
  withHandlers({
    onDoubleClick: ({ dispatch, workspace }: SelectionInnerProps) => (event: React.MouseEvent<any>) => {
      const selection = getBoundedWorkspaceSelection(workspace);      
      if (selection.length === 1) {
        dispatch(selectorDoubleClicked(selection[0], event));
      }
    }
  })
);

export const  SelectionStageTool = enhanceSelectionStageTool(SelectionStageToolBase);

export * from "./resizer";