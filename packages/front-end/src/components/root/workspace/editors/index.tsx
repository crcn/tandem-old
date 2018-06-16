import "./index.scss";
import { Dispatch } from "redux";
import * as React from "react";
import { compose, pure, withHandlers } from "recompose";
import { RootState, Editor, isImageMimetype } from "../../../../state";
const { Editor } = require("./editor.pc");

export type EditorsOuterProps = {
  root: RootState;
  dispatch: Dispatch<any>;
};

type EditorsInnerProps = {} & EditorsOuterProps;

const EditorsBaseComponent = ({ root, dispatch }: EditorsInnerProps) => {
  return (
    <div className="m-editors">
      {root.editors.map((editor, i) => {
        return (
          <Editor key={i} editor={editor} root={root} dispatch={dispatch} />
        );
      })}
    </div>
  );
};

export const EditorsComponent = compose<EditorsOuterProps, EditorsOuterProps>(
  pure
)(EditorsBaseComponent);
