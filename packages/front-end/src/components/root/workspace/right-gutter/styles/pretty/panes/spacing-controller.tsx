import * as React from "react";
import { compose, pure, withHandlers } from "recompose";
import { cssPropertyChangeCompleted, cssPropertyChanged } from "actions";
import {
  DropdownMenuOption,
  dropdownMenuOptionFromValue
} from "../../../../../../inputs/dropdown/controller";
import { memoize } from "tandem-common";
import { SyntheticVisibleNode } from "paperclip";

const BOX_SIZING_OPTIONS: DropdownMenuOption[] = [
  undefined,
  "border-box",
  "content-box"
].map(dropdownMenuOptionFromValue);

export default compose(
  pure,
  withHandlers({
    onClick: () => () => {},
    onPropertyChange: ({ dispatch }) => (name, value) => {
      dispatch(cssPropertyChanged(name, value));
    },
    onPropertyChangeComplete: ({ dispatch }) => (name, value) => {
      dispatch(cssPropertyChangeCompleted(name, value));
    }
  }),
  Base => ({ onPropertyChange, onPropertyChangeComplete, selectedNodes }) => {
    const node: SyntheticVisibleNode = selectedNodes[0];
    return (
      <Base
        boxSizingInputProps={{
          options: BOX_SIZING_OPTIONS,
          value: node.style["box-sizing"],
          onChangeComplete: propertyChangeCallback(
            "box-sizing",
            onPropertyChangeComplete
          )
        }}
        marginLeftInputProps={{
          value: node.style["margin-left"],
          onChange: propertyChangeCallback("margin-left", onPropertyChange),
          onChangeComplete: propertyChangeCallback(
            "margin-left",
            onPropertyChangeComplete
          )
        }}
        marginTopInputProps={{
          value: node.style["margin-top"],
          onChange: propertyChangeCallback("margin-top", onPropertyChange),
          onChangeComplete: propertyChangeCallback(
            "margin-top",
            onPropertyChangeComplete
          )
        }}
        marginRightInputProps={{
          value: node.style["margin-right"],
          onChange: propertyChangeCallback("margin-right", onPropertyChange),
          onChangeComplete: propertyChangeCallback(
            "margin-right",
            onPropertyChangeComplete
          )
        }}
        marginBottomInputProps={{
          value: node.style["margin-bottom"],
          onChange: propertyChangeCallback("margin-bottom", onPropertyChange),
          onChangeComplete: propertyChangeCallback(
            "margin-bottom",
            onPropertyChangeComplete
          )
        }}
        paddingLeftInputProps={{
          value: node.style["padding-left"],
          onChange: propertyChangeCallback("padding-left", onPropertyChange),
          onChangeComplete: propertyChangeCallback(
            "padding-left",
            onPropertyChangeComplete
          )
        }}
        paddingTopInputProps={{
          value: node.style["padding-top"],
          onChange: propertyChangeCallback("padding-top", onPropertyChange),
          onChangeComplete: propertyChangeCallback(
            "padding-top",
            onPropertyChangeComplete
          )
        }}
        paddingRightInputProps={{
          value: node.style["padding-right"],
          onChange: propertyChangeCallback("padding-right", onPropertyChange),
          onChangeComplete: propertyChangeCallback(
            "padding-right",
            onPropertyChangeComplete
          )
        }}
        paddingBottomInputProps={{
          value: node.style["padding-bottom"],
          onChange: propertyChangeCallback("padding-bottom", onPropertyChange),
          onChangeComplete: propertyChangeCallback(
            "padding-bottom",
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
