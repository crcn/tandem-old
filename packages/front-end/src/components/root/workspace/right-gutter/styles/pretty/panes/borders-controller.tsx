import * as React from "react";
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

export default (Base: React.ComponentClass<BaseBorderProps>) =>
  class BordersController extends React.PureComponent<Props> {
    onPropertyChange = (name, value) => {
      this.props.dispatch(cssPropertyChanged(name, value));
    };
    onPropertyChangeComplete = (name, value) => {
      this.props.dispatch(cssPropertyChangeCompleted(name, value));
    };
    render() {
      const { selectedNodes } = this.props;
      const { onPropertyChange, onPropertyChangeComplete } = this;

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
  };

const propertyChangeCallback = memoize((name: string, listener) => value =>
  listener(name, value)
);
