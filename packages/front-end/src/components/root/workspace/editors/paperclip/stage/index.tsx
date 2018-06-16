import "./index.scss";
import { Dispatch } from "redux";
import * as React from "react";
import { pure, compose } from "recompose";
import { CanvasComponent } from "./canvas";
import { FooterComponent } from "./footer";
import { Dependency } from "paperclip";
import { RootState, Editor } from "../../../../../../state";

export type StageOuterProps = {
  root: RootState;
  editor: Editor;
  dependency: Dependency<any>;
  dispatch: Dispatch<any>;
};

const BaseStageComponent = ({
  root,
  editor,
  dependency,
  dispatch
}: StageOuterProps) => (
  <div className="m-stage">
    <CanvasComponent
      root={root}
      dependency={dependency}
      dispatch={dispatch}
      editor={editor}
    />
    {/* <FooterComponent /> */}
  </div>
);

export const StageComponent = compose<StageOuterProps, StageOuterProps>(pure)(
  BaseStageComponent
);
