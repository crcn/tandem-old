import * as React from "react";
import { arraySplice } from "tandem-common";
import { clamp, noop } from "lodash";
import { compose, pure, withHandlers } from "recompose";

export default compose(
  pure,
  Base => ({ onChange = noop, value: [r, g, b, a] = [0, 0, 0, 0] }) => {
    const changeCallback = index => value =>
      onChange(
        arraySplice([r, g, b, a], index, 1, clamp(Number(value), 0, 255))
      );
    return (
      <Base
        rInputProps={{
          value: r,
          onChange: changeCallback(0)
        }}
        gInputProps={{
          value: g,
          onChange: changeCallback(1)
        }}
        bInputProps={{
          value: b,
          onChange: changeCallback(2)
        }}
        aInputProps={{
          value: a,
          onChange: changeCallback(3)
        }}
      />
    );
  }
);
