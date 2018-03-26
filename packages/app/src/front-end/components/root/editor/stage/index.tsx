import "./index.scss";
import * as React from "react";
import { pure, compose } from "recompose";
import { CanvasComponent } from "./canvas";
import { FooterComponent } from "./footer";
import { ToolbarComponent } from "./toolbar";
import { SyntheticWindow, Dependency } from "paperclip";
import { RootState, getActiveWindow } from "front-end/state";

getActiveWindow

export type StageOuterProps = {
  window: SyntheticWindow;
  dependency: Dependency;
};

const BaseStageComponent = ({window, dependency}: StageOuterProps) => <div className="m-stage">
  <ToolbarComponent />
  <CanvasComponent window={window} dependency={dependency} />
  <FooterComponent />
</div>;

export const StageComponent = compose<StageOuterProps, StageOuterProps>(pure)(BaseStageComponent);