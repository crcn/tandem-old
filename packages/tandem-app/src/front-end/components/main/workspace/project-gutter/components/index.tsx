import * as React from "react";
import { Pane } from "front-end/components/pane";
import { Dispatcher } from "aerial-common2";
import { pure, compose } from "recompose";
import { Workspace, AvalaibleComponent, AVAILABLE_COMPONENT, withDragSource, ConnectDragSource } from "front-end/state";

export type ComponentsPaneInnerProps = {
  workspace: Workspace;
  dispatch: Dispatcher<any>;
};

type AvailableComponentPaneRowProps = {
  dispatch: Dispatcher<any>;
  component: AvalaibleComponent;
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
    getData: ({ component }: AvailableComponentPaneRowProps) => [AVAILABLE_COMPONENT, component.$id]
  }),
)(AvailableComponentBase);

export const ComponentsPaneBase = ({ workspace, dispatch }: ComponentsPaneInnerProps) => {
  
  return <Pane title="Components">
    { 
      workspace.availableComponents.map((availableComponent) => {
        return <AvailableComponent key={availableComponent.$id} component={availableComponent} dispatch={dispatch} />
      })
    }
  </Pane>;
};

const enhanceComponentsPane = compose<ComponentsPaneInnerProps, ComponentsPaneInnerProps>(
  pure
);

export const ComponentsPane = enhanceComponentsPane(ComponentsPaneBase);
