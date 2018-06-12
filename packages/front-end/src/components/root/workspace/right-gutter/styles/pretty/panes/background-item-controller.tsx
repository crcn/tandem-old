import * as React from "react";
import { compose, pure, withHandlers } from "recompose";

export default compose(
  pure,
  Base => ({ value, onChange, onChangeComplete }) => {
    return (
      <Base
        colorInputProps={{
          value,
          onChange,
          onChangeComplete
        }}
        textInputProps={{
          value,
          onChangeComplete
        }}
      />
    );
  }
);
