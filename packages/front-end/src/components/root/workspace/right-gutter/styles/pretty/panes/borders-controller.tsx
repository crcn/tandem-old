import * as React from "react";
import {
  cssPropertyChangeCompleted,
  cssPropertyChanged
} from "../../../../../../../actions";
import { memoize } from "tandem-common";
import { SyntheticElement, PCVariable } from "paperclip";
import { Dispatch } from "redux";
import { BaseBorderProps } from "./borders.pc";
import { ComputedStyleInfo } from "../../state";

export type Props = {
  globalVariables: PCVariable[];
  dispatch: Dispatch;
  computedStyleInfo: ComputedStyleInfo;
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
      const { computedStyleInfo, globalVariables } = this.props;
      const { onPropertyChange, onPropertyChangeComplete } = this;

      if (!computedStyleInfo) {
        return null;
      }
      return (
        <Base
          borderStylingProps={{
            globalVariables,
            computedStyleInfo,
            onPropertyChange,
            onPropertyChangeComplete
          }}
          bottomLeftRadiusInputProps={{
            value: computedStyleInfo.style["border-bottom-left-radius"],
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
            value: computedStyleInfo.style["border-bottom-right-radius"],
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
            value: computedStyleInfo.style["border-top-left-radius"],
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
            value: computedStyleInfo.style["border-top-right-radius"],
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
