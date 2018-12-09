import * as React from "react";
import { BaseSolidColorPickerProps } from "./view.pc";
import { CSSSolidBackground } from "./state";
import { ColorSwatchGroup } from "../../../../../../../../inputs/color/color-swatch-controller";

export type Props = {
  value: CSSSolidBackground;
  onChange?: any;
  onChangeComplete?: any;
  swatchOptionGroups: ColorSwatchGroup[];
};

export default (Base: React.ComponentClass<BaseSolidColorPickerProps>) =>
  class BackgroundPickerController extends React.PureComponent<Props> {
    render() {
      const {
        value,
        onChange,
        onChangeComplete,
        swatchOptionGroups,
        ...rest
      } = this.props;
      return (
        <Base
          {...rest}
          colorPickerProps={{
            value: value.color,
            onChange,
            onChangeComplete,
            swatchOptionGroups
          }}
        />
      );
    }
  };
