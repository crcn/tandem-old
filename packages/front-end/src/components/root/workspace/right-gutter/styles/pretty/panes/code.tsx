import * as React from "react";
import { compose, pure, withHandlers } from "recompose";
import { RootState } from "state";
import { stringifyStyle, EMPTY_OBJECT } from "tandem-common";
import { rawCssTextChanged } from "../../../../../../../actions";

export default compose(
  pure,
  withHandlers({
    onClick: () => () => {},
    onChange: ({ dispatch }) => value => {
      console.log(value);
      dispatch(rawCssTextChanged(value));
    }
  }),
  Base => ({ onChange, selectedNodes, ...rest }) => {
    const cssText = getSelectedNodeStyle(selectedNodes);
    return (
      <Base
        {...rest}
        textareaProps={{
          value: cssText,
          onChange
        }}
      />
    );
  }
);

const getSelectedNodeStyle = selectedNodes => {
  const node = selectedNodes[0];
  return (
    node &&
    stringifyStyle(node.style || EMPTY_OBJECT)
      .split(";")
      .join(";\n")
  );
};
