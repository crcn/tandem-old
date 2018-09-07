import * as React from "react";
import { EMPTY_ARRAY } from "tandem-common";
import { BaseColorInputProps } from "./view.pc";
import { ColorPicker } from "./picker.pc";

export type Props = {
  value: any;
  onChange: any;
  onChangeComplete: any;
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

      const { value, onChange, onChangeComplete, ...rest } = this.props;
      const { onButtonClick, onShouldClose } = this;

      if (open) {
        popdownChildren = (
          <ColorPicker
            value={value || "#FF0000"}
            onChange={onChange}
            onChangeComplete={onChangeComplete}
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
              background: value || "transparent"
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
