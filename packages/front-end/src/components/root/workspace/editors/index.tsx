import "./index.scss";
import { Dispatch } from "redux";
import * as React from "react";
import { compose, pure, withHandlers } from "recompose";
import { RootState, EditorWindow, isImageMimetype } from "../../../../state";
const { Editor } = require("./editor.pc");

export type EditorWindowsOuterProps = {
  root: RootState;
  dispatch: Dispatch<any>;
};

type EditorWindowsInnerProps = {} & EditorWindowsOuterProps;

const EditorWindowsBaseComponent = ({
  root,
  dispatch
}: EditorWindowsInnerProps) => {
  return (
    <div className="m-editors">
      {root.editorWindows.map((editorWindow, i) => {
        return (
          <Editor
            key={i}
            editorWindow={editorWindow}
            root={root}
            dispatch={dispatch}
          />
        );
      })}
    </div>
  );
};

export const EditorWindowsComponent = compose<
  EditorWindowsOuterProps,
  EditorWindowsOuterProps
>(pure)(EditorWindowsBaseComponent);
