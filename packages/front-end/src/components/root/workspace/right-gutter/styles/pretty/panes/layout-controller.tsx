import * as React from "react";
import { memoize } from "tandem-common";
import { compose, pure, withHandlers } from "recompose";
import {
  cssPropertyChangeCompleted,
  cssPropertyChanged
} from "../../../../../../../actions";
import { DropdownMenuOption } from "../../../../../../inputs/dropdown/controller";

export const DISPLAY_MENU_OPTIONS: DropdownMenuOption[] = [
  "block",
  "inline-block",
  "flex",
  "inline-flex",
  "none",
  "inline"
].map(value => ({ label: value, value }));

export const POSITION_MENU_OPTIONS: DropdownMenuOption[] = [
  "static",
  "relative",
  "absolute",
  "fixed"
].map(value => ({ label: value, value }));

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
    if (!selectedNodes) {
      return null;
    }
    const node = selectedNodes[0];
    return (
      <Base
        displayInputProps={{
          value: node.style.display,
          options: DISPLAY_MENU_OPTIONS,
          onChangeComplete: propertyChangeCallback(
            "display",
            onPropertyChangeComplete
          )
        }}
        positionInputProps={{
          value: node.style.position,
          options: POSITION_MENU_OPTIONS,
          onChangeComplete: propertyChangeCallback(
            "position",
            onPropertyChangeComplete
          )
        }}
        leftInputProps={{
          value: node.style.left,
          onChangeComplete: propertyChangeCallback(
            "left",
            onPropertyChangeComplete
          )
        }}
        topInputProps={{
          value: node.style.top,
          onChangeComplete: propertyChangeCallback(
            "top",
            onPropertyChangeComplete
          )
        }}
        widthInputProps={{
          value: node.style.width,
          onChange: propertyChangeCallback("width", onPropertyChange),
          onChangeComplete: propertyChangeCallback(
            "width",
            onPropertyChangeComplete
          )
        }}
        heightInputProps={{
          value: node.style.height,
          onChange: propertyChangeCallback("height", onPropertyChange),
          onChangeComplete: propertyChangeCallback(
            "height",
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
