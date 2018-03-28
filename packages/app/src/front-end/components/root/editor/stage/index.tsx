import "./index.scss";
import { Dispatch } from "redux";
import * as React from "react";
import { pure, compose } from "recompose";
import { CanvasComponent } from "./canvas";
import { FooterComponent } from "./footer";
import { ToolbarComponent } from "./toolbar";
import { SyntheticWindow, Dependency } from "paperclip";
import { RootState, getActiveWindow } from "front-end/state";

getActiveWindow

export type StageOuterProps = {
  root: RootState;
  dependency: Dependency;
  dispatch: Dispatch<any>;
};

const BaseStageComponent = ({root, dependency, dispatch}: StageOuterProps) => <div className="m-stage">
  <ToolbarComponent />
  <CanvasComponent root={root} dependency={dependency} dispatch={dispatch}  />
  <FooterComponent />
</div>;

export const StageComponent = compose<StageOuterProps, StageOuterProps>(pure)(BaseStageComponent);