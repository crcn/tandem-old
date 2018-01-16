import * as React from "react";
import { compose, pure, withHandlers } from "recompose";
import { hydrateTdComponentsPane, TdComponentsPaneInnerProps, hydrateTdComponentsPaneCell, TdComponentsPaneCellInnerProps, } from "./components-pane.pc";
import { Pane } from "./pane";
import { componentsPaneAddComponentClicked, componentsPaneComponentClicked } from "../actions";
import { Dispatcher } from "aerial-common2";
import { Workspace, withDragSource, ConnectDragSource, AvailableComponent, AVAILABLE_COMPONENT } from "front-end/state";

const ICON_SIZE = 15;

export type ComponentsPaneOuterProps = {
  workspace: Workspace;
  dispatch: Dispatcher<any>;
};

export type ComponentsPaneInnerProps = {
  onAddComponentClick: (event: React.MouseEvent<any>) => any;
} & ComponentsPaneOuterProps;

type ComponentsPaneCellOuterProps = AvailableComponent & {
  hovering: boolean;
  dispatch: Dispatcher<any>;
};

type ComponentsPaneCellInnerProps = {
  connectDragSource: ConnectDragSource;
  dispatch: Dispatcher<any>;
} & TdComponentsPaneCellInnerProps;

const enhanceComponentsPaneCell = compose<TdComponentsPaneCellInnerProps, ComponentsPaneCellOuterProps>(
  pure,
  withDragSource({
    getData: ({ tagName }: ComponentsPaneCellOuterProps) => [AVAILABLE_COMPONENT, tagName],
    start: (props: ComponentsPaneCellOuterProps) => (event: React.DragEvent<any>) => {
      if (props.screenshots.length) {
        const screenshot = props.screenshots
        [0];

        // TODO - this isn't working for now
        const nativeEvent = event.nativeEvent;
        const image = new Image();
        image.src = `/components/${props.tagName}/screenshots/${screenshot.previewName}/latest.png`;
        nativeEvent.dataTransfer.setDragImage(image, 0, 0);
      }
    }
  }),
  withHandlers({
    onClick: ({ dispatch, tagName }: ComponentsPaneCellOuterProps) => (event) => {
      dispatch(componentsPaneComponentClicked(tagName, event));
    }
  }),
  (Base: React.ComponentClass<TdComponentsPaneCellInnerProps>) => ({ label, selected, screenshots, connectDragSource, onClick, dispatch }: ComponentsPaneCellInnerProps) => {
    const screenshot = screenshots.length ? screenshots[0] : null;
    let width = screenshot && screenshot.clip.right - screenshot.clip.left;
    let height = screenshot && screenshot.clip.bottom - screenshot.clip.top;
    let scale = 1;

    if (width >= height && width > ICON_SIZE) {
      scale = ICON_SIZE / width;
    } else if (height >= width && height > ICON_SIZE) {
      scale = ICON_SIZE / height;
    }

    return connectDragSource(<Base label={label} onClick={onClick} selected={selected} screenshot={screenshot} screenshotScale={scale} hovering={false} onDragStart={null} onDragEnd={null} />);
  }
);

const enhanceComponentsPane = compose<TdComponentsPaneInnerProps, ComponentsPaneOuterProps>(
  pure,
  withHandlers({
    onAddComponentClick: ({ dispatch }: ComponentsPaneOuterProps) => (event: React.MouseEvent<any>) => {
      dispatch(componentsPaneAddComponentClicked());
    }
  }),
  (Base: React.ComponentClass<TdComponentsPaneInnerProps>) => ({ workspace, dispatch, onAddComponentClick }: ComponentsPaneInnerProps) => {
    const components = (workspace.availableComponents || []).map((component) => ({
      ...component,
      selected: workspace.selectionRefs.find((ref) => ref[1] === component.tagName)
    })).sort((a, b) => a.tagName > b.tagName ? 1 : -1);

    return <Base components={components} dispatch={dispatch} onAddComponentClick={onAddComponentClick} nativeComponentsTabSelected={true} nativeElementsTabSelected={false} nativeElements={[]} />;
  }
);

const ComponentsPaneCell = hydrateTdComponentsPaneCell(enhanceComponentsPaneCell, {});

export const ComponentsPane = hydrateTdComponentsPane(enhanceComponentsPane, {
  TdPane: Pane,
  TdList: null,
  TdListItem: null,
  TdComponentsPaneCell: ComponentsPaneCell
});
