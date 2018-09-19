import * as React from "react";
import { EMPTY_ARRAY } from "tandem-common";
import { BaseColorInputProps } from "./view.pc";
import { ColorPicker } from "./picker.pc";
import {
  ColorSwatchOption,
  maybeConvertSwatchValueToColor
} from "./color-swatch-controller";

export type Props = {
  value: any;
  onChange: any;
  onChangeComplete: any;
  swatchOptions: ColorSwatchOption[];
} & BaseColorInputProps;

type InnerProps = {
  open: boolean;
  setOpen: any;
  onButtonClick: any;
  onShouldClose: any;
} & Props;

type State = {
  open: boolean;
};

export default (Base: React.ComponentClass<BaseColorInputProps>) =>
  class ColorInputController extends React.PureComponent<Props> {
    state = { open: false };
    onButtonClick = () => {
      this.setState({ ...this.state, open: !this.state.open });
    };
    onShouldClose = () => {
      this.setState({ ...this.state, open: false });
    };
    render() {
      let popdownChildren: any = EMPTY_ARRAY;
      const { open } = this.state;

      const {
        value,
        onChange,
        swatchOptions,
        onChangeComplete,
        ...rest
      } = this.props;
      const { onButtonClick, onShouldClose } = this;

      if (open) {
        popdownChildren = (
          <ColorPicker
            value={value || "#FF0000"}
            onChange={onChange}
            onChangeComplete={onChangeComplete}
            swatchOptions={swatchOptions}
          />
        );
      }

      return (
        <Base
          {...rest}
          buttonProps={{
            tabIndex: 0,
            onClick: onButtonClick,
            style: {
              background:
                maybeConvertSwatchValueToColor(value, swatchOptions) ||
                "transparent"
            }
          }}
          popoverProps={{
            open,
            onShouldClose
          }}
          content={popdownChildren}
        />
      );
    }
  };
