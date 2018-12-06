import * as React from "react";
import { CSSBackgroundType } from "./state";
import * as cx from "classnames";
import { BaseBackgroundPickerProps } from "./view.pc";
import { ColorSwatchGroup } from "../../../../../../../../inputs/color/color-swatch-controller";

export type Props = {
  value: string;
  onChange?: any;
  onChangeComplete?: any;
  swatchOptionGroups: ColorSwatchGroup[];
};

type State = {
  backgroundType: CSSBackgroundType;
};

export default (Base: React.ComponentClass<BaseBackgroundPickerProps>) =>
  class BackgroundPickerController extends React.PureComponent<Props, State> {
    state = {
      backgroundType: CSSBackgroundType.SOLID
    };
    onTypeClick = (backgroundType: CSSBackgroundType) => {
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
            solid: backgroundType === CSSBackgroundType.SOLID,
            linearGradient:
              backgroundType === CSSBackgroundType.LINEAR_GRADIENT,
            image: backgroundType === CSSBackgroundType.IMAGE
          })}
          solidToggleButtonProps={{
            onClick: () => onTypeClick(CSSBackgroundType.SOLID)
          }}
          linearGradientButtonProps={{
            onClick: () => onTypeClick(CSSBackgroundType.LINEAR_GRADIENT)
          }}
          imageToggleButtonProps={{
            onClick: () => onTypeClick(CSSBackgroundType.IMAGE)
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
