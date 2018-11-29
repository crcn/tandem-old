import * as React from "react";
import { BaseLinearGradientPickerProps } from "./view.pc";
import { ColorSwatchGroup } from "../../../../../../../../inputs/color/color-swatch-controller";

export type Props = {
  value: string;
  onChange?: any;
  onChangeComplete?: any;
  swatchOptionGroups: ColorSwatchGroup[];
};

export default (Base: React.ComponentClass<BaseLinearGradientPickerProps>) =>
  class BackgroundGradientPickerController extends React.PureComponent<Props> {
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
            value,
            onChange,
            onChangeComplete,
            swatchOptionGroups
          }}
        />
      );
    }
  };
