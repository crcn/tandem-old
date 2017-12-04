import * as React from "react";
import { Dispatcher } from "aerial-common2";
import { ApplicationState, Workspace, SyntheticBrowser } from "front-end/state";
import { ComponentsPane, WindowsPane, Gutter } from "front-end/components/enhanced";

export type ProjectGutterProps = {
  workspace: Workspace;
  browser: SyntheticBrowser;
  dispatch: Dispatcher<any>;
}

export const ProjectGutterBase = ({ workspace, browser, dispatch }: ProjectGutterProps) => <Gutter left right={false}>
  <WindowsPane windows={browser.windows || []} dispatch={dispatch} workspace={workspace} />
  <ComponentsPane workspace={workspace} dispatch={dispatch} />
</Gutter>;

export const ProjectGutter = ProjectGutterBase;

// export * from "./file-navigator";
export * from "./windows";