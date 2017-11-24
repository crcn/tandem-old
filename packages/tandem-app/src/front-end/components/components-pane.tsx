import * as React from "react";
import { compose, pure, withHandlers } from "recompose";
import { hydrateTdComponentsPane, TdComponentsPaneInnerProps, hydrateTdComponentsPaneCell, TdComponentsPaneCellInnerProps, } from "./components-pane.pc";
import { Pane } from "./pane";
import { componentsPaneAddComponentClicked } from "../actions";
import { Dispatcher } from "aerial-common2";
import { Workspace, withDragSource, ConnectDragSource, AvailableComponent, AVAILABLE_COMPONENT } from "front-end/state";

const ICON_SIZE = 110;

export type ComponentsPaneOuterProps = {
  workspace: Workspace;
  dispatch: Dispatcher<any>;
};

export type ComponentsPaneInnerProps = {
  onAddComponentClick: (event: React.MouseEvent<any>) => any;
} & ComponentsPaneOuterProps;

type ComponentsPaneCellOuterProps = AvailableComponent & {
  dispatch: Dispatcher<any>;
};

type ComponentsPaneCellInnerProps = {
  connectDragSource: ConnectDragSource;
  dispatch: Dispatcher<any>;
} & TdComponentsPaneCellInnerProps;

const enhanceComponentsPaneCell = compose<TdComponentsPaneCellInnerProps, ComponentsPaneCellOuterProps>(
  pure,
  withDragSource({
    getData: ({ tagName }: ComponentsPaneCellOuterProps) => [AVAILABLE_COMPONENT, tagName]
  }),
  (Base: React.ComponentClass<TdComponentsPaneCellInnerProps>) => ({ label, screenshot, connectDragSource, dispatch }: ComponentsPaneCellInnerProps) => {
    let width = screenshot && screenshot.clip.right - screenshot.clip.left;
    let height = screenshot && screenshot.clip.bottom - screenshot.clip.top;
    let scale = 1;

    if (width >= height && width > ICON_SIZE) {
      scale = ICON_SIZE / width;
    } else if (height >= width && height > ICON_SIZE) {
      scale = ICON_SIZE / height;
    }

    // const larger = Math.max(width, height);
    // const ratio = CELL_SIZE
    return connectDragSource(<Base label={label} screenshot={screenshot} screenshotScale={scale} hovering={false} onDragStart={null} onDragEnd={null} />);
  }
);

const enhanceComponentsPane = compose<TdComponentsPaneInnerProps, ComponentsPaneOuterProps>(
  pure,
  withHandlers({
    onAddComponentClick: ({ dispatch }: ComponentsPaneOuterProps) => (event: React.MouseEvent<any>) => {
      dispatch(componentsPaneAddComponentClicked());
    }
  }),
  (Base: React.ComponentClass<TdComponentsPaneInnerProps>) => ({ workspace, dispatch, onAddComponentClick }: ComponentsPaneInnerProps) => <Base components={workspace.availableComponents || []} dispatch={dispatch} onAddComponentClick={onAddComponentClick} />
);

const ComponentsPaneCell = hydrateTdComponentsPaneCell(enhanceComponentsPaneCell, {});

export const ComponentsPane = hydrateTdComponentsPane(enhanceComponentsPane, {
  TdPane: Pane,
  TdComponentsPaneCell: ComponentsPaneCell
});
