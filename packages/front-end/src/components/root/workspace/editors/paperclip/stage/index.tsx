import "./index.scss";
import { Dispatch } from "redux";
import * as React from "react";
import { pure, compose } from "recompose";
import { CanvasComponent } from "./canvas";
import { FooterComponent } from "./footer";
import { Dependency } from "paperclip";
import { RootState, EditorWindow } from "../../../../../../state";

export type StageOuterProps = {
  root: RootState;
  editorWindow: EditorWindow;
  dependency: Dependency<any>;
  dispatch: Dispatch<any>;
};

const BaseStageComponent = ({
  root,
  editorWindow,
  dependency,
  dispatch
}: StageOuterProps) => (
  <div className="m-stage">
    <CanvasComponent
      root={root}
      dependency={dependency}
      dispatch={dispatch}
      editorWindow={editorWindow}
    />
    {/* <FooterComponent /> */}
  </div>
);

export const StageComponent = compose<StageOuterProps, StageOuterProps>(pure)(
  BaseStageComponent
);
