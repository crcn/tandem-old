import "./index.scss";
import { Dispatch } from "redux";
import * as React from "react";
import { Dependency } from "paperclip";
import { compose, pure } from "recompose";
import { LeftGutterComponent } from "./left-gutter";
import { RightGutterComponent } from "./right-gutter";
import { RootState } from "../../../state";
const { Modal: QuickSearchModal } = require("../../quick-search/index.pc");
import { DragDropContext } from "react-dnd";
import { EditorsComponent } from "./editors";
import HTML5Backend, { IHTML5BackendContext } from "react-dnd-html5-backend";

export type EditorOuterProps = {
  root: RootState;
  dispatch: Dispatch<any>;
};

const WorksapceBaseComponent = ({ root, dispatch }: EditorOuterProps) => {
  return (
    <div className="m-workspace">
      <LeftGutterComponent
        editors={root.editors}
        rootDirectory={root.projectDirectory}
        dispatch={dispatch}
        root={root}
      />
      <EditorsComponent root={root} dispatch={dispatch} />
      <RightGutterComponent root={root} dispatch={dispatch} />
      <QuickSearchModal root={root} dispatch={dispatch} />
    </div>
  );
};

export const WorkspaceComponent = compose<EditorOuterProps, EditorOuterProps>(
  pure,
  DragDropContext(HTML5Backend)
)(WorksapceBaseComponent);
