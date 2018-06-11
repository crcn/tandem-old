import * as React from "react";
import { compose, pure, withHandlers } from "recompose";
import { cssPropertyChanged, cssPropertyChangeCompleted } from "actions";

type OpacityPaneOuterProps = {
  // selectedNodes:
};

export default compose(
  pure,
  withHandlers({
    onChange: ({ dispatch }) => value => {
      console.log(value);
      dispatch(cssPropertyChanged("opacity", value));
    },
    onChangeComplete: ({ dispatch }) => value => {
      dispatch(cssPropertyChangeCompleted("opacity", value));
    }
  }),
  Base => ({ onChange, onChangeComplete, selectedNodes }) => {
    if (!selectedNodes) {
      return null;
    }
    const node = selectedNodes[0];
    return (
      <Base
        sliderInputProps={{
          min: 0,
          max: 1,
          value: node.style.opacity || 1,
          onChange,
          onChangeComplete
        }}
      />
    );
  }
);
