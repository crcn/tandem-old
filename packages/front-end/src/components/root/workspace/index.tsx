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
import { EditorWindowsComponent } from "./editors";
import HTML5Backend, { IHTML5BackendContext } from "react-dnd-html5-backend";

export type EditorWindowOuterProps = {
  root: RootState;
  dispatch: Dispatch<any>;
};

const WorksapceBaseComponent = ({ root, dispatch }: EditorWindowOuterProps) => {
  return (
    <div className="m-workspace">
      <LeftGutterComponent
        editorWindows={root.editorWindows}
        rootDirectory={root.projectDirectory}
        dispatch={dispatch}
        root={root}
      />
      <EditorWindowsComponent root={root} dispatch={dispatch} />
      <RightGutterComponent root={root} dispatch={dispatch} />
      <QuickSearchModal root={root} dispatch={dispatch} />
    </div>
  );
};

export const WorkspaceComponent = compose<
  EditorWindowOuterProps,
  EditorWindowOuterProps
>(pure, DragDropContext(HTML5Backend))(WorksapceBaseComponent);
