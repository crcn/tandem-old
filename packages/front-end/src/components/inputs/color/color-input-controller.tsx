import * as React from "react";
import { EMPTY_ARRAY } from "tandem-common";
import { compose, pure, withHandlers, withState } from "recompose";
import { BaseColorInputProps } from "./view.pc";
import { ColorPicker } from "./picker.pc";

export type Props = {
  value: any;
  onChange: any;
  onChangeComplete: any;
};

type InnerProps = {
  open: boolean;
  setOpen: any;
  onButtonClick: any;
  onFocus: any;
  onBlur: any;
  onShouldClose: any;
} & Props;

export default compose<BaseColorInputProps, Props>(
  pure,
  withState("open", "setOpen", false),
  withHandlers({
    onButtonClick: ({ open, setOpen }) => () => {
      setOpen(!open);
    },
    onFocus: ({ setOpen }) => () => {},
    onBlur: ({ setOpen }) => () => {},
    onShouldClose: ({ setOpen }) => () => {
      setOpen(false);
    }
  }),
  (Base: React.ComponentClass<BaseColorInputProps>) => ({
    open,
    value,
    onButtonClick,
    onFocus,
    onBlur,
    onChange,
    onChangeComplete,
    onShouldClose,
    ...rest
  }: InnerProps) => {
    let popdownChildren: any = EMPTY_ARRAY;

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
          onFocus,
          onBlur,
          style: {
            background: value || "transparent"
          }
        }}
        popoverProps={{
          open,
          onShouldClose
        }}
        // contentProps={{
        //   children: popdownChildren
        // }}
      />
    );
  }
);
