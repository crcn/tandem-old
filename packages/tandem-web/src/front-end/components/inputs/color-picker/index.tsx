import "./index.css"
import * as React from "react";
import { compose, pure } from "recompose";

export type ColorPickerComponentOuterProps = {
  value: [number, number, number, number]
};

const BaseColorPickerComponent = () => <div className="m-color-picker">
</div>;

const enhance = compose<ColorPickerComponentOuterProps, ColorPickerComponentOuterProps>(
  pure
);

export const ColorPickerComponent = BaseColorPickerComponent;

