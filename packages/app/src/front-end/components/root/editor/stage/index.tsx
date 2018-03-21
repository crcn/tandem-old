import "./index.scss";
import * as React from "react";
import { ToolbarComponent } from "./toolbar";
import { CanvasComponent } from "./canvas";
import { FooterComponent } from "./footer";

const BaseStageComponent = () => <div className="m-stage">
  <ToolbarComponent />
  <CanvasComponent />
  <FooterComponent />
</div>;

export const StageComponent = BaseStageComponent;