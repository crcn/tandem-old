import * as React from "react";
import { compose, pure } from "recompose";
import { hydrateTdComponentsPane, TdComponentsPaneInnerProps, hydrateTdComponentsPaneCell, TdComponentsPaneCellInnerProps, } from "./components-pane.pc";
import { Pane } from "./pane";
import { Dispatcher } from "aerial-common2";
import { Workspace, withDragSource, ConnectDragSource, AvailableComponent, AVAILABLE_COMPONENT } from "front-end/state";

const ICON_SIZE = 110;

/*

import * as React from "react";
import { Pane } from "front-end/components/pane/index";
import { Dispatcher } from "aerial-common2";
import { pure, compose } from "recompose";
import { Workspace, AvailableComponent, AVAILABLE_COMPONENT, withDragSource, ConnectDragSource } from "front-end/state";

export type ComponentsPaneInnerProps = {
  workspace: Workspace;
  dispatch: Dispatcher<any>;
};

type AvailableComponentPaneRowProps = {
  dispatch: Dispatcher<any>;
  component: AvailableComponent;
}

type AvailableComponentPaneRowInnerProps = {
  connectDragSource: ConnectDragSource;
} & AvailableComponentPaneRowProps;

const AvailableComponentBase = ({ component, connectDragSource }: AvailableComponentPaneRowInnerProps) => {
  return connectDragSource(<div>
    {component.label}
  </div>);
}

const availableComponentSource = {
  beginDrag(props: AvailableComponentPaneRowProps) {
    return {
      text: props.component
    };
  }
}

const AvailableComponent = compose<AvailableComponentPaneRowInnerProps, AvailableComponentPaneRowProps>(
  pure,
  withDragSource({
    getData: ({ component }: AvailableComponentPaneRowProps) => [AVAILABLE_COMPONENT, component.tagName]
  }),
)(AvailableComponentBase);

export const ComponentsPaneBase = ({ workspace, dispatch }: ComponentsPaneInnerProps) => {
  
  return <Pane title="Components">
    { 
      workspace.availableComponents.map((availableComponent) => {
        return <AvailableComponent key={availableComponent.tagName} component={availableComponent} dispatch={dispatch} />
      })
    }
  </Pane>;
};

const enhanceComponentsPane = compose<ComponentsPaneInnerProps, ComponentsPaneInnerProps>(
  pure
);

export const ComponentsPane = enhanceComponentsPane(ComponentsPaneBase);
*/

export type ComponentsPaneOuterProps = {
  workspace: Workspace;
  dispatch: Dispatcher<any>;
};

type ComponentsPaneCellOuterProps = AvailableComponent;
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
    return connectDragSource(<Base label={label} screenshot={screenshot} screenshotScale={scale} hovering={false} />);
  }
);

const enhanceComponentsPane = compose<TdComponentsPaneInnerProps, ComponentsPaneOuterProps>(
  pure,
  (Base: React.ComponentClass<TdComponentsPaneInnerProps>) => ({ workspace, dispatch }: ComponentsPaneOuterProps) => <Base components={workspace.availableComponents || []} dispatch={dispatch} />
);

export const ComponentsPane = hydrateTdComponentsPane(enhanceComponentsPane, {
  TdPane: Pane,
  TdComponentsPaneCell: hydrateTdComponentsPaneCell(enhanceComponentsPaneCell, {
    
  })
});
