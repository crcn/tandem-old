import * as React from "react";
import { compose, pure, withHandlers } from "recompose";
import { PCSourceTagNames, SyntheticVisibleNode } from "paperclip";
import { textValueChanged } from "actions";

export default compose(
  pure,
  withHandlers({
    onTextValueChange: ({ dispatch }) => value => {
      dispatch(textValueChanged(value));
    }
  }),
  Base => ({ dispatch, selectedNodes, onTextValueChange }) => {
    const textNode = selectedNodes.find(
      (node: SyntheticVisibleNode) => node.name == PCSourceTagNames.TEXT
    );
    return (
      <Base
        textInputProps={{
          value: textNode.value,
          onChange: onTextValueChange
        }}
      />
    );
  }
);
