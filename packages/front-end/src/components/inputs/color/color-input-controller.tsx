import * as React from "react";
import { EMPTY_ARRAY } from "tandem-common";
import { compose, pure, withHandlers, withState } from "recompose";
const { ColorPicker } = require("./picker.pc");

export default compose(
  pure,
  withState("open", "setOpen", false),
  withHandlers({
    onButtonClick: ({ open, setOpen }) => () => {
      setOpen(!open);
    },
    onFocus: ({ setOpen }) => () => {},
    onBlur: ({ setOpen }) => () => {},
    onEmptySpaceClick: ({ setOpen }) => () => {
      setOpen(false);
    }
  }),
  Base => ({
    open,
    value,
    onButtonClick,
    onFocus,
    onBlur,
    onChange,
    onChangeComplete,
    onEmptySpaceClick,
    ...rest
  }) => {
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
          focusable: true,
          onEmptySpaceClick
        }}
        contentProps={{
          children: popdownChildren
        }}
      />
    );
  }
);
