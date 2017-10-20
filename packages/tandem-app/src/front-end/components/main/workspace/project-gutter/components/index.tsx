import * as React from "react";
import { Pane } from "front-end/components/pane";
import { Dispatcher } from "aerial-common2";
import { pure, compose } from "recompose";
import { Workspace, AvalaibleComponent, AVAILABLE_COMPONENT } from "front-end/state";

export type ComponentsPaneInnerProps = {
  workspace: Workspace;
  dispatch: Dispatcher<any>;
};

type AvailableComponentPaneRowProps = {
  component: AvalaibleComponent;
}


type AvailableComponentPaneRowInnerProps = {
  component: AvalaibleComponent;
} & AvailableComponentPaneRowProps;

const AvailableComponentBase = ({ component }: AvailableComponentPaneRowInnerProps) => {
  return <div draggable>
    {component.label}
  </div>;
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
)(AvailableComponentBase);

export const ComponentsPaneBase = ({ workspace }: ComponentsPaneInnerProps) => {
  
  return <Pane title="Components">
    { 
      workspace.availableComponents.map((availableComponent) => {
        return <AvailableComponent key={availableComponent.$id} component={availableComponent} />
      })
    }
  </Pane>;
};

const enhanceComponentsPane = compose<ComponentsPaneInnerProps, ComponentsPaneInnerProps>(
  pure
);

export const ComponentsPane = enhanceComponentsPane(ComponentsPaneBase);
