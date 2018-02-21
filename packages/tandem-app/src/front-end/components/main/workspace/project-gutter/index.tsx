import * as React from "react";
import { Dispatcher } from "aerial-common2";
import { ApplicationState, Workspace } from "front-end/state";
import { FileNavigator } from "./file-navigator";
import { Gutter } from "front-end/components/gutter";
// import { ComponentsPane, Gutter, ArtboardsPane } from "front-end/components/enhanced";

export type ProjectGutterProps = {
  workspace: Workspace;
  dispatch: Dispatcher<any>;
}

export const ProjectGutterBase = ({ workspace, dispatch }: ProjectGutterProps) => <Gutter left right={false}>
  <FileNavigator />
</Gutter>;

export const ProjectGutter = ProjectGutterBase;

// export * from "./file-navigator";