import * as React from "react";
import { compose, pure, withHandlers } from "recompose";
import { cssPropertyChangeCompleted, cssPropertyChanged } from "actions";

export default compose(
  pure,
  withHandlers({
    onPropertyChange: ({ dispatch }) => (name, value) => {
      dispatch(cssPropertyChanged(name, value));
    },
    onPropertyChangeComplete: ({ dispatch }) => (name, value) => {
      dispatch(cssPropertyChangeCompleted(name, value));
    }
  }),
  Base => ({ selectedNodes, onPropertyChange, onPropertyChangeComplete }) => {
    if (!selectedNodes) {
      return null;
    }
    return (
      <Base
        borderStylingProps={{
          selectedNode: selectedNodes[0],
          onPropertyChange,
          onPropertyChangeComplete
        }}
      />
    );
  }
);
