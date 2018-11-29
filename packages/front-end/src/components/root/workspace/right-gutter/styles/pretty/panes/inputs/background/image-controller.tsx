import * as React from "react";
import { BaseBackgroundImagePickerProps } from "./view.pc";
import { ColorSwatchGroup } from "../../../../../../../../inputs/color/color-swatch-controller";

export type Props = {
  value: string;
  onChange?: any;
  onChangeComplete?: any;
  swatchOptionGroups: ColorSwatchGroup[];
};

export default (Base: React.ComponentClass<BaseBackgroundImagePickerProps>) =>
  class BackgroundGradientPickerController extends React.PureComponent<Props> {
    render() {
      const {
        value,
        onChange,
        onChangeComplete,
        swatchOptionGroups,
        ...rest
      } = this.props;
      return <Base {...rest} />;
    }
  };
