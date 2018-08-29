import * as React from "react";
import { compose, pure, withHandlers } from "recompose";
import {
  cssPropertyChangeCompleted,
  cssPropertyChanged
} from "../../../../../../../actions";
import { memoize } from "tandem-common";
import { SyntheticElement } from "paperclip";
import { Dispatch } from "redux";
import { BaseBorderProps } from "./borders.pc";

export type Props = {
  selectedNodes: SyntheticElement[];
  dispatch: Dispatch;
};

type InnerProps = {
  onPropertyChange: any;
  onPropertyChangeComplete: any;
} & Props;

export default compose<InnerProps, Props>(
  pure,
  withHandlers({
    onPropertyChange: ({ dispatch }) => (name, value) => {
      dispatch(cssPropertyChanged(name, value));
    },
    onPropertyChangeComplete: ({ dispatch }) => (name, value) => {
      dispatch(cssPropertyChangeCompleted(name, value));
    }
  }),
  (Base: React.ComponentClass<BaseBorderProps>) => ({
    selectedNodes,
    onPropertyChange,
    onPropertyChangeComplete
  }) => {
    if (!selectedNodes) {
      return null;
    }
    const selectedNode = selectedNodes[0];
    return (
      <Base
        borderStylingProps={{
          selectedNode,
          onPropertyChange,
          onPropertyChangeComplete
        }}
        bottomLeftRadiusInputProps={{
          value: selectedNode.style["border-bottom-left-radius"],
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
          value: selectedNode.style["border-bottom-right-radius"],
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
          value: selectedNode.style["border-top-left-radius"],
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
          value: selectedNode.style["border-top-right-radius"],
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
