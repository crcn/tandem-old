import * as React from "react";
import { compose, pure } from "recompose";
import { BaseEditorWindowsProps } from "./editor-windows.pc";
import { RootState } from "../../../../state";
import { Dispatch } from "redux";
const { Editor } = require("./editor.pc");

export type Props = {
  root: RootState;
  dispatch: Dispatch<any>;
};

export default compose<BaseEditorWindowsProps, Props>(
  pure,
  (Base: React.ComponentClass<BaseEditorWindowsProps>) => ({
    root,
    dispatch
  }) => {
    return (
      <Base>
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
      </Base>
    );
  }
);
