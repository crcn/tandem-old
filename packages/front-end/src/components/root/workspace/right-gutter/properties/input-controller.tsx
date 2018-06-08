import * as React from "react";
import { pure, compose, withHandlers } from "recompose";
import { attributeChanged } from "../../../../../actions";

export default compose(
  pure,
  withHandlers({
    onPlaceholderChange: ({ dispatch }) => value => {
      dispatch(attributeChanged("placeholder", value));
    }
  }),
  Base => ({ selectedNodes, onPlaceholderChange }) => {
    if (!selectedNodes) {
      return null;
    }
    const element = selectedNodes[0];
    return (
      <Base
        placeholderInputProps={{
          value: element.attributes.placeholder,
          onChange: onPlaceholderChange
        }}
      />
    );
  }
);
