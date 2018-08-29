import * as React from "react";
import { EMPTY_ARRAY } from "tandem-common";
import { compose, pure, withHandlers, withState } from "recompose";
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

export default compose<BaseColorInputProps, Props>(
  pure,
  withState("open", "setOpen", false),
  withHandlers({
    onButtonClick: ({ open, setOpen }) => () => {
      setOpen(!open);
    },
    onShouldClose: ({ setOpen }) => () => {
      setOpen(false);
    }
  }),
  (Base: React.ComponentClass<BaseColorInputProps>) => ({
    open,
    value,
    onButtonClick,
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
);
