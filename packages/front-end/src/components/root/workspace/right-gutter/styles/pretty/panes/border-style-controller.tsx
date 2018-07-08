import * as React from "react";
import { compose, pure, withHandlers } from "recompose";
import {
  DropdownMenuOption,
  dropdownMenuOptionFromValue
} from "../../../../../../inputs/dropdown/controller";
import { memoize, EMPTY_ARRAY } from "tandem-common";

const STYLE_OPTIONS = [
  undefined,
  "solid",
  "dotted",
  "double",
  "groove",
  "ridge",
  "inset",
  "outset",
  "initial",
  "inherit",
  "hidden",
  "none"
].map(dropdownMenuOptionFromValue);

type BorderInfo = {
  style: string;
  color: string;
  thickness: string;
};

// none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset|initial|inherit

export default compose(
  pure,
  withHandlers({
    onStyleChangeComplete: ({ value, onChangeComplete }) => style => {
      onChangeComplete(stringifyBorderInfo({ ...parseBorder(value), style }));
    },
    onColorChange: ({ value, onChange }) => color => {
      onChange(stringifyBorderInfo({ ...parseBorder(value), color }));
    },
    onColorChangeComplete: ({ onChangeComplete, value }) => color => {
      onChangeComplete(stringifyBorderInfo({ ...parseBorder(value), color }));
    },
    onThicknessCHange: ({ onChange, value }) => thickness => {
      onChange(stringifyBorderInfo({ ...parseBorder(value), thickness }));
    },
    onThicknessChangeComplete: ({ onChangeComplete, value }) => thickness => {
      onChangeComplete(
        stringifyBorderInfo({ ...parseBorder(value), thickness })
      );
    }
  }),
  Base => ({
    value,
    onStyleChangeComplete,
    onColorChange,
    onColorChangeComplete,
    onThicknessChange,
    onThicknessChangeComplete
  }) => {
    const { style, color, thickness } = parseBorder(value);

    return (
      <Base
        colorInputProps={{
          value: color,
          onChange: onColorChange,
          onChangeComplete: onColorChangeComplete
        }}
        styleInputProps={{
          value: style,
          options: STYLE_OPTIONS,
          onChangeComplete: onStyleChangeComplete
        }}
        thicknessInputProps={{
          value: thickness,
          onChange: onThicknessChange,
          onChangeComplete: onThicknessChangeComplete
        }}
      />
    );
  }
);

const parseBorder = memoize(
  (value = "") => ({
    style: (value.match(
      /(none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset|initial|inherit)/
    ) || EMPTY_ARRAY)[1],
    color: (value.match(/(#\w+|rgba?\(.*?\))/) || EMPTY_ARRAY)[1],
    thickness: (value.match(/(\d+px)/) || EMPTY_ARRAY)[1]
  }),
  100
);

const stringifyBorderInfo = (info: BorderInfo) =>
  [info.thickness || "0px", info.style, info.color].join(" ").trim();
