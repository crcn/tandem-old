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
  Base => ({ selectedNodes, onTextValueChange, ...rest }) => {
    const textNode = selectedNodes.find(
      (node: SyntheticVisibleNode) => node.name == PCSourceTagNames.TEXT
    );
    if (!textNode) {
      return null;
    }
    return (
      <Base
        {...rest}
        textInputProps={{
          value: textNode.value,
          onChange: onTextValueChange
        }}
      />
    );
  }
);
