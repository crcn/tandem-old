import * as React from "react";
import { compose, pure, withHandlers } from "recompose";
import { stringifyStyle, EMPTY_OBJECT } from "tandem-common";
import { rawCssTextChanged } from "../../../../../../../actions";
import { BaseCodeProps } from "./code.pc";
import { Dispatch } from "redux";
import { SyntheticElement } from "paperclip";

export type Props = {
  dispatch: Dispatch<any>;
  selectedNodes: SyntheticElement[];
};

export type InnerProps = {
  onChange: any;
} & Props;

export default compose<InnerProps, Props>(
  pure,
  withHandlers({
    onChange: ({ dispatch }) => value => {
      dispatch(rawCssTextChanged(value));
    }
  }),
  (Base: React.ComponentClass<BaseCodeProps>) => ({
    onChange,
    selectedNodes,
    ...rest
  }: InnerProps) => {
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
