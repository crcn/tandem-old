import "./index.scss";
import * as React from "react";
import { pure, compose } from "recompose";
import { SyntheticWindow } from "paperclip";
import { CanvasComponent } from "./canvas";
import { FooterComponent } from "./footer";
import { ToolbarComponent } from "./toolbar";
import { RootState, getActiveWindow } from "front-end/state";

getActiveWindow

export type StageOuterProps = {
  window: SyntheticWindow;
};

const BaseStageComponent = ({window}: StageOuterProps) => <div className="m-stage">
  <ToolbarComponent />
  <CanvasComponent window={window} />
  <FooterComponent />
</div>;

export const StageComponent = compose<StageOuterProps, StageOuterProps>(pure)(BaseStageComponent);