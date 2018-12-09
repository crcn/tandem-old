import * as React from "react";
import {
  CSSBackgroundType,
  CSSBackground,
  CSSSolidBackground,
  CSSLinearGradientBackground
} from "./state";
import * as cx from "classnames";
import { BaseBackgroundPickerProps } from "./view.pc";
import { ColorSwatchGroup } from "../../../../../../../../inputs/color/color-swatch-controller";
import { ComputedStyleInfo } from "paperclip";

export type Props = {
  value: CSSBackground;
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
      if (!value) {
        return value;
      }
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
            value: value as CSSSolidBackground,
            onChange,
            onChangeComplete,
            swatchOptionGroups
          }}
          linearGradientPickerProps={{
            value: value as CSSLinearGradientBackground,
            onChange,
            onChangeComplete,
            swatchOptionGroups
          }}
        />
      );
    }
  };
