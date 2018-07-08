import * as React from "react";
import { compose, pure, withHandlers } from "recompose";
import { cssPropertyChangeCompleted, cssPropertyChanged } from "actions";
import { memoize } from "tandem-common";

export default compose(
  pure,
  withHandlers({
    onPropertyChange: ({ dispatch }) => (name, value) => {
      console.log(name, value);
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
        bottomLeftRadiusInputProps={{
          onChange: propertyChangeCallback(
            "border-bottom-left-radius",
            onPropertyChange
          ),
          onChangeComplete: propertyChangeCallback(
            "border-bottom-left-radius",
            onPropertyChangeComplete
          )
        }}
        bottomRightRadiusInputProps={{
          onChange: propertyChangeCallback(
            "border-bottom-right-radius",
            onPropertyChange
          ),
          onChangeComplete: propertyChangeCallback(
            "border-bottom-right-radius",
            onPropertyChangeComplete
          )
        }}
        topLeftRadiusInputProps={{
          onChange: propertyChangeCallback(
            "border-top-left-radius",
            onPropertyChange
          ),
          onChangeComplete: propertyChangeCallback(
            "border-top-left-radius",
            onPropertyChangeComplete
          )
        }}
        topRightRadiusInputProps={{
          onChange: propertyChangeCallback(
            "border-top-right-radius",
            onPropertyChange
          ),
          onChangeComplete: propertyChangeCallback(
            "border-top-right-radius",
            onPropertyChangeComplete
          )
        }}
      />
    );
  }
);

const propertyChangeCallback = memoize((name: string, listener) => value =>
  listener(name, value)
);
