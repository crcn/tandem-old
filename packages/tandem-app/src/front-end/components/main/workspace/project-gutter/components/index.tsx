import * as React from "react";
import { pure, compose } from "recompose";
import { Pane } from "front-end/components/pane";
import { Dispatcher } from "aerial-common2";
import { Workspace, AvalaibleComponent } from "front-end/state";

export type ComponentsPaneInnerProps = {
  workspace: Workspace;
  dispatch: Dispatcher<any>;
};

type AvailableComponentPaneRowProps = {
  component: AvalaibleComponent;
}

const AvailableComponentBase = ({ component }: AvailableComponentPaneRowProps) => {
  return <div>
    {component.label}
  </div>;
}

const AvailableComponent = compose<AvailableComponentPaneRowProps, AvailableComponentPaneRowProps>(
  pure
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
