import * as React from "react";
import { EMPTY_ARRAY } from "tandem-common";
import { compose, pure, withHandlers, withState } from "recompose";
const { ColorPicker } = require("./picker.pc");

export default compose(
  pure,
  withState("visible", "setVisible", false),
  withHandlers({
    onButtonClick: ({ visible, setVisible }) => () => {
      setVisible(!visible);
    }
  }),
  Base => ({ visible, value, onButtonClick }) => {
    let popdownChildren = EMPTY_ARRAY;

    if (visible) {
      popdownChildren = [<ColorPicker />];
    }

    return (
      <Base
        buttonProps={{ onClick: onButtonClick, style: { background: value } }}
        popdownProps={{
          style: {
            display: visible ? "block" : "none"
          },
          children: popdownChildren
        }}
      />
    );
  }
);
