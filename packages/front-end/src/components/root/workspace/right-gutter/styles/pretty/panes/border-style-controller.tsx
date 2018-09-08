import * as React from "react";
import { dropdownMenuOptionFromValue } from "../../../../../../inputs/dropdown/controller";
import { memoize, EMPTY_ARRAY } from "tandem-common";
import { BaseBorderStyleProps } from "./borders.pc";

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

export type Props = {
  value: string;
  onChange: any;
  onChangeComplete: any;
};

export default (Base: React.ComponentClass<BaseBorderStyleProps>) =>
  class BorderStyleController extends React.PureComponent<Props> {
    onStyleChangeComplete = style => {
      this.props.onChangeComplete(
        stringifyBorderInfo({ ...parseBorder(this.props.value), style })
      );
    };
    onColorChange = color => {
      this.props.onChange(
        stringifyBorderInfo({ ...parseBorder(this.props.value), color })
      );
    };
    onColorChangeComplete = color => {
      this.props.onChangeComplete(
        stringifyBorderInfo({ ...parseBorder(this.props.value), color })
      );
    };
    onThicknessChange = thickness => {
      this.props.onChange(
        stringifyBorderInfo({ ...parseBorder(this.props.value), thickness })
      );
    };
    onThicknessChangeComplete = thickness => {
      this.props.onChangeComplete(
        stringifyBorderInfo({ ...parseBorder(this.props.value), thickness })
      );
    };
    render() {
      const { value } = this.props;
      const {
        onColorChange,
        onColorChangeComplete,
        onStyleChangeComplete,
        onThicknessChange,
        onThicknessChangeComplete
      } = this;

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
  };

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
