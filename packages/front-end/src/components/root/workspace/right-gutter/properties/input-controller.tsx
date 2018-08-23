import * as React from "react";
import { pure, compose, withHandlers } from "recompose";
import { attributeChanged } from "../../../../../actions";
import { SyntheticElement } from "paperclip";

export type Props = {
  selectedNodes: SyntheticElement[];
};

type InnerProps = {
  onPlaceholderChange: any;
} & Props;

export default compose<InnerProps, Props>(
  pure,
  withHandlers({
    onPlaceholderChange: ({ dispatch }) => value => {
      dispatch(attributeChanged("placeholder", value));
    }
  }),
  (Base: React.ComponentClass<any>) => ({
    selectedNodes,
    onPlaceholderChange
  }) => {
    if (!selectedNodes.lenght) {
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
