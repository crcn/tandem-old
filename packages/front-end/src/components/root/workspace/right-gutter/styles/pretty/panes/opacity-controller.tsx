import * as React from "react";
import { compose, pure, withHandlers } from "recompose";
import {
  cssPropertyChanged,
  cssPropertyChangeCompleted
} from "../../../../../../../actions";
import { Dispatch } from "redux";
import { SyntheticElement } from "paperclip";
import { BaseOpacityPaneProps } from "./opacity.pc";

export type Props = {
  dispatch: Dispatch<any>;
  selectedNodes: SyntheticElement[];
};

type InnerProps = {
  onChange: any;
  onChangeComplete: any;
} & Props;

export default compose<InnerProps, Props>(
  pure,
  withHandlers({
    onChange: ({ dispatch }) => value => {
      dispatch(cssPropertyChanged("opacity", value));
    },
    onChangeComplete: ({ dispatch }) => value => {
      dispatch(cssPropertyChangeCompleted("opacity", value));
    }
  }),
  (Base: React.ComponentClass<BaseOpacityPaneProps>) => ({
    onChange,
    onChangeComplete,
    selectedNodes
  }: InnerProps) => {
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
