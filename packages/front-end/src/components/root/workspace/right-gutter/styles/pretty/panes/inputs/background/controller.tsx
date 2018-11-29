import * as React from "react";
import * as cx from "classnames";
import { BaseBackgroundPickerProps } from "./view.pc";
import { ColorSwatchGroup } from "../../../../../../../../inputs/color/color-swatch-controller";

export type Props = {
  value: string;
  onChange?: any;
  onChangeComplete?: any;
  swatchOptionGroups: ColorSwatchGroup[];
};

enum BackgroundType {
  SOLID,
  LINEAR_GRADIENT,
  IMAGE
}

type State = {
  backgroundType: BackgroundType;
};

export default (Base: React.ComponentClass<BaseBackgroundPickerProps>) =>
  class BackgroundPickerController extends React.PureComponent<Props, State> {
    state = {
      backgroundType: BackgroundType.SOLID
    };
    onTypeClick = (backgroundType: BackgroundType) => {
      this.setState({ backgroundType });
    };
    render() {
      const {
        value,
        onChange,
        onChangeComplete,
        swatchOptionGroups,
        ...rest
      } = this.props;
      const { backgroundType } = this.state;
      const { onTypeClick } = this;
      return (
        <Base
          {...rest}
          variant={cx({
            solid: backgroundType === BackgroundType.SOLID,
            linearGradient: backgroundType === BackgroundType.LINEAR_GRADIENT,
            image: backgroundType === BackgroundType.IMAGE
          })}
          solidToggleButtonProps={{
            onClick: () => onTypeClick(BackgroundType.SOLID)
          }}
          linearGradientButtonProps={{
            onClick: () => onTypeClick(BackgroundType.LINEAR_GRADIENT)
          }}
          imageToggleButtonProps={{
            onClick: () => onTypeClick(BackgroundType.IMAGE)
          }}
          solidColorPickerProps={{
            value,
            onChange,
            onChangeComplete,
            swatchOptionGroups
          }}
          linearGradientPickerProps={{
            value,
            onChange,
            onChangeComplete,
            swatchOptionGroups
          }}
        />
      );
    }
  };
