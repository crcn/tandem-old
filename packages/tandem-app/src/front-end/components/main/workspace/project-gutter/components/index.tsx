import * as React from "react";
import { pure, compose } from "recompose";
import { Pane } from "front-end/components/pane";
import { Dispatcher } from "aerial-common2";
import { Workspace } from "front-end/state";

export type ComponentsPaneInnerProps = {
  workspace: Workspace;
  dispatch: Dispatcher<any>;
};

export const ComponentsPaneBase = (props) => {
  return <Pane title="Components">
  </Pane>;
};

const enhanceComponentsPane = compose<ComponentsPaneInnerProps, ComponentsPaneInnerProps>(
  pure
);

export const ComponentsPane = enhanceComponentsPane(ComponentsPaneBase);
