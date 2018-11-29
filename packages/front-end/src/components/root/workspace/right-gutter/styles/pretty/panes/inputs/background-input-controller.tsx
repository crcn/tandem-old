import * as React from "react";
import { BaseBackgroundInputProps } from "./view.pc";
import { BackgroundPicker } from "./background/view.pc";
import { ColorSwatchGroup } from "../../../../../../../inputs/color/color-swatch-controller";

export type Props = {
  value: any;
  onChange: any;
  onChangeComplete: any;
  swatchOptionGroups: ColorSwatchGroup[];
};

export default (Base: React.ComponentClass<BaseBackgroundInputProps>) =>
  class BackgroundInputController extends React.PureComponent<Props> {
    render() {
      const { ...rest } = this.props;
      return (
        <Base
          {...rest}
          renderColorPicker={props => <BackgroundPicker {...props} />}
        />
      );
    }
  };
