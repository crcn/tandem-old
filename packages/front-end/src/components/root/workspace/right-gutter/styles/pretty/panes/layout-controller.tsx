import * as React from "react";
import { compose, pure, withHandlers } from "recompose";
import { RootState } from "state";
import { stringifyStyle, EMPTY_OBJECT } from "tandem-common";
import { cssPropertyChangeCompleted } from "../../../../../../../actions";
import { DropdownMenuItem } from "../../../../../../inputs/dropdown/controller";

export const DISPLAY_MENU_OPTIONS: DropdownMenuItem[] = [
  "block",
  "inline-block",
  "flex",
  "inline-flex",
  "none",
  "inline"
].map(value => ({ label: value, value }));

export const POSITION_MENU_OPTIONS: DropdownMenuItem[] = [
  "static",
  "relative",
  "absolute",
  "fixed"
].map(value => ({ label: value, value }));

export default compose(
  pure,
  withHandlers({
    onClick: () => () => {},
    onDisplayChange: ({ dispatch }) => value => {
      dispatch(cssPropertyChangeCompleted("display", value));
    },
    onPositionChange: ({ dispatch }) => value => {
      console.log(value);
      dispatch(cssPropertyChangeCompleted("position", value));
    },
    onLeftChange: ({ dispatch }) => value => {
      dispatch(cssPropertyChangeCompleted("left", value));
    },
    onTopChange: ({ dispatch }) => value => {
      dispatch(cssPropertyChangeCompleted("top", value));
    },
    onWidthChange: ({ dispatch }) => value => {
      dispatch(cssPropertyChangeCompleted("width", value));
    },
    onHeightChange: ({ dispatch }) => value => {
      dispatch(cssPropertyChangeCompleted("height", value));
    }
  }),
  Base => ({
    onDisplayChange,
    onPositionChange,
    onLeftChange,
    onTopChange,
    onWidthChange,
    onHeightChange,
    selectedNodes,
    ...rest
  }) => {
    if (!selectedNodes) {
      return null;
    }
    const node = selectedNodes[0];
    return (
      <Base
        displayInputProps={{
          value: node.style.display,
          options: DISPLAY_MENU_OPTIONS,
          onChange: onDisplayChange
        }}
        positionInputProps={{
          value: node.style.position,
          options: POSITION_MENU_OPTIONS,
          onChange: onPositionChange
        }}
        leftInputProps={{
          value: node.style.left,
          onChange: onLeftChange
        }}
        topInputProps={{
          value: node.style.top,
          onChange: onTopChange
        }}
        widthInputProps={{
          value: node.style.width,
          onChange: onWidthChange
        }}
        heightInputProps={{
          value: node.style.height,
          onChange: onHeightChange
        }}
      />
    );
  }
);
