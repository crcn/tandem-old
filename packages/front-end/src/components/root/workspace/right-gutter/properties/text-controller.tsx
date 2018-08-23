import * as React from "react";
import { compose, pure, withHandlers } from "recompose";
import {
  PCSourceTagNames,
  SyntheticVisibleNode,
  SyntheticElement,
  SyntheticTextNode
} from "paperclip";
import { textValueChanged } from "actions";
import { BaseTextPropertiesProps } from "./view.pc";
import { Dispatch } from "redux";

export type Props = {
  dispatch: Dispatch<any>;
  selectedNodes: SyntheticVisibleNode[];
} & BaseTextPropertiesProps;

type InnerProps = {
  onTextValueChange: any;
} & Props;

export default compose<InnerProps, Props>(
  pure,
  withHandlers({
    onTextValueChange: ({ dispatch }) => value => {
      dispatch(textValueChanged(value));
    }
  }),
  (Base: React.ComponentClass<BaseTextPropertiesProps>) => ({
    selectedNodes,
    onTextValueChange,
    ...rest
  }: InnerProps) => {
    const textNode = selectedNodes.find(
      (node: SyntheticVisibleNode) => node.name == PCSourceTagNames.TEXT
    ) as SyntheticTextNode;

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
