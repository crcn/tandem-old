import * as React from "react";
import * as cx from "classnames";
import { compose, pure, withHandlers, withState } from "recompose";
import { memoize } from "tandem-common";
import { ButtonBarOption } from "../../../../../../inputs/button-bar/controller";
import { BaseBorderStylesProps } from "./borders.pc";
import { SyntheticElement } from "paperclip";
const {
  EmptySquareIcon,
  BordersIcon
} = require("../../../../../../../icons/index.pc");

enum TOGGLE_OPTION {
  ALL,
  INDIVIDUAL
}

const TOGGLE_OPTIONS: ButtonBarOption[] = [
  {
    icon: <EmptySquareIcon style={{ height: "100%" }} />,
    value: TOGGLE_OPTION.ALL
  },
  {
    icon: <BordersIcon style={{ height: "100%" }} />,
    value: TOGGLE_OPTION.INDIVIDUAL
  }
];

export type Props = {
  selectedNode: SyntheticElement;
  onPropertyChange: any;
  onPropertyChangeComplete: any;
};

export type InnerProps = {
  borderStyling: TOGGLE_OPTION;
  onStyleToggleChangeComplete: any;
} & Props;

export default compose<InnerProps, Props>(
  pure,
  withState(
    "borderStyling",
    "setBorderStyling",
    ({ selectedNode }) =>
      selectedNode.style["border-left"] ||
      selectedNode.style["border-right"] ||
      selectedNode.style["border-top"] ||
      selectedNode.style["border-bottom"]
        ? TOGGLE_OPTION.INDIVIDUAL
        : TOGGLE_OPTION.ALL
  ),
  withHandlers({
    onStyleToggleChangeComplete: ({ setBorderStyling }) => value => {
      setBorderStyling(value);
    }
  }),
  (Base: React.ComponentClass<BaseBorderStylesProps>) => ({
    borderStyling,
    selectedNode,
    onPropertyChange,
    onPropertyChangeComplete,
    onStyleToggleChangeComplete,
    ...rest
  }) => {
    return (
      <Base
        {...rest}
        variant={cx({
          all: borderStyling === TOGGLE_OPTION.ALL,
          individual: borderStyling === TOGGLE_OPTION.INDIVIDUAL
        })}
        // togglerProps={{
        //   value: borderStyling,
        //   options: TOGGLE_OPTIONS,
        //   onChange: onStyleToggleChangeComplete
        // }}
        borderInputProps={{
          value: selectedNode.style.border,
          onChange: propertyChangeCallback("border", onPropertyChange),
          onChangeComplete: propertyChangeCallback(
            "border",
            onPropertyChangeComplete
          )
        }}
        borderLeftInputProps={{
          value: selectedNode.style["border-left"],
          onChange: propertyChangeCallback("border-left", onPropertyChange),
          onChangeComplete: propertyChangeCallback(
            "border-left",
            onPropertyChangeComplete
          )
        }}
        borderRightInputProps={{
          value: selectedNode.style["border-right"],
          onChange: propertyChangeCallback("border-right", onPropertyChange),
          onChangeComplete: propertyChangeCallback(
            "border-right",
            onPropertyChangeComplete
          )
        }}
        borderTopInputProps={{
          value: selectedNode.style["border-top"],
          onChange: propertyChangeCallback("border-top", onPropertyChange),
          onChangeComplete: propertyChangeCallback(
            "border-top",
            onPropertyChangeComplete
          )
        }}
        borderBottomInputProps={{
          value: selectedNode.style["border-bottom"],
          onChange: propertyChangeCallback("border-bottom", onPropertyChange),
          onChangeComplete: propertyChangeCallback(
            "border-bottom",
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
