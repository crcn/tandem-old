/**
 * tools overlay like measurements, resizers, etc
 */

import "./index.scss";
import * as React from "react";
import { ColorPickerComponent } from "front-end/components/inputs/color-picker";

const BaseToolsLayerComponent = () => <div className="m-tools-layer">
  <ColorPickerComponent value="#00FF00" />
</div>;

export const ToolsLayerComponent = BaseToolsLayerComponent;