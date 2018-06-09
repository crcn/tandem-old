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
    onFocus: ({ setOpen }) => () => {
      setOpen(true);
    },
    onBlur: ({ setOpen }) => () => {
      setOpen(false);
    }
  }),
  Base => ({ open, value, onButtonClick, onFocus, onBlur }) => {
    let popdownChildren: any = EMPTY_ARRAY;

    if (open) {
      popdownChildren = <ColorPicker />;
    }

    return (
      <Base
        buttonProps={{
          tabIndex: 0,
          onClick: onButtonClick,
          onFocus,
          onBlur,
          style: {
            background: value
          }
        }}
        popoverProps={{
          open,
          focusable: true
        }}
        contentProps={{
          style: {
            display: open ? "block" : "none"
          },
          children: popdownChildren
        }}
      />
    );
  }
);
