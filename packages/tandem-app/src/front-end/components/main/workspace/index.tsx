import "./index.scss";
import * as React from "react";
import { pure, compose } from "recompose";
import { SyntheticBrowser } from "aerial-browser-sandbox";
import { Dispatcher, Message } from "aerial-common2";
import { ElementGutter } from "./element-gutter";
import { ProjectGutter } from "./project-gutter";
import { Stage } from "./stage";
// import { TextEditor } from "./text-editor";
import { Breadcrumbs } from "./breadcrumbs";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { Workspace as WorkspaceStruct, ApplicationState } from "front-end/state";

export type WorkspaceProps = {
  workspace: WorkspaceStruct;
  browser: SyntheticBrowser;
  state: ApplicationState;
  dispatch?:  Dispatcher<any>
};

export const WorkspaceBase = ({ state, workspace, browser, dispatch }: WorkspaceProps) => {
  const stage = workspace.stage;

  return <div className="workspace-component">
    { stage.showLeftGutter ? <ProjectGutter workspace={workspace} browser={browser} dispatch={dispatch} /> : null }
    <div className="workspace-editors">
      <div className="workspace-stage">
        <Stage workspace={workspace} dispatch={dispatch} browser={browser} />
        <Breadcrumbs workspace={workspace} dispatch={dispatch} browser={browser} />
      </div>
    </div>
    { stage.showRightGutter ? <ElementGutter browser={browser} workspace={workspace} dispatch={dispatch} /> : null }
  </div>
};

export const Workspace = compose<WorkspaceProps, WorkspaceProps>(
  pure,
  DragDropContext(HTML5Backend),
)(WorkspaceBase);
