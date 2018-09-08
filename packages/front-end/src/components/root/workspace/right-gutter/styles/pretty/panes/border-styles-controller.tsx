import * as React from "react";
import * as cx from "classnames";
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

type State = {
  borderStyling: TOGGLE_OPTION;
};

export default (Base: React.ComponentClass<BaseBorderStylesProps>) =>
  class BorderStylesController extends React.PureComponent<Props, State> {
    constructor(props) {
      super(props);
      const { selectedNode } = props;
      this.state = {
        borderStyling:
          selectedNode.style["border-left"] ||
          selectedNode.style["border-right"] ||
          selectedNode.style["border-top"] ||
          selectedNode.style["border-bottom"]
            ? TOGGLE_OPTION.INDIVIDUAL
            : TOGGLE_OPTION.ALL
      };
    }
    setBorderStyling = (value: TOGGLE_OPTION) => {
      this.setState({ ...this.state, borderStyling: value });
    };

    onStyleToggleChangeComplete = value => {
      this.setBorderStyling(value);
    };
    render() {
      const {
        onPropertyChange,
        onPropertyChangeComplete,
        selectedNode,
        ...rest
      } = this.props;
      const { borderStyling } = this.state;
      const { onStyleToggleChangeComplete } = this;

      return (
        <Base
          {...rest}
          variant={cx({
            all: borderStyling === TOGGLE_OPTION.ALL,
            individual: borderStyling === TOGGLE_OPTION.INDIVIDUAL
          })}
          togglerProps={{
            value: borderStyling,
            options: TOGGLE_OPTIONS,
            onChange: onStyleToggleChangeComplete
          }}
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
  };

const propertyChangeCallback = memoize((name: string, listener) => value =>
  listener(name, value)
);
