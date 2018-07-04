import * as React from "react";
import { compose, pure } from "recompose";
const { Editor } = require("./editor.pc");

export default compose(
  pure,
  Base => ({ root, dispatch }) => {
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
