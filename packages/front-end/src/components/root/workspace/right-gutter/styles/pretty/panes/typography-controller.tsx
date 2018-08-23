import * as React from "react";
import { memoize } from "tandem-common";
import { ButtonBarOption } from "../../../../../../inputs/button-bar/controller";
import { DropdownMenuOption } from "../../../../../../inputs/dropdown/controller";
import { compose, pure, withHandlers } from "recompose";
import {
  cssPropertyChangeCompleted,
  cssPropertyChanged
} from "../../../../../../../actions";
import { FontFamily } from "../../../../../../../state";
import { BaseTypographProps } from "./typography.pc";
import { Dispatch } from "redux";
import { SyntheticElement } from "paperclip";
const {
  TextLeftIcon,
  TextCenterIcon,
  TextJustifyIcon,
  TextRightIcon
} = require("../../../../../../../icons/index.pc");

const FONT_FAMILIES: DropdownMenuOption[] = ["Helvetica", "Roboto"].map(
  value => ({ label: value, value })
);

const getFontFamilyOptions = memoize((fontFamiles: FontFamily[]) =>
  fontFamiles
    .map(family => ({ label: family.name, value: family.name }))
    .sort((a, b) => (a.label > b.label ? 1 : -1))
);

const FONT_WEIGHTS: DropdownMenuOption[] = ["100", "200", "300", "400"].map(
  value => ({ label: value, value })
);

const DECORATIONS: DropdownMenuOption[] = [
  "underline",
  "overline",
  "line-through"
].map(value => ({ label: value, value }));

const ALIGNMENTS: ButtonBarOption[] = [
  {
    value: "left",
    icon: <TextLeftIcon />
  },
  {
    value: "center",
    icon: <TextCenterIcon />
  },
  {
    value: "justify",
    icon: <TextJustifyIcon />
  },
  {
    value: "right",
    icon: <TextRightIcon />
  }
];

export type Props = {
  dispatch: Dispatch<any>;
  selectedNodes: SyntheticElement[];
  fontFamilies: FontFamily[];
};

export type InnerProps = {
  onPropertyChange: any;
  onPropertyChangeComplete: any;
} & Props;

export default compose(
  pure,
  withHandlers({
    onPropertyChange: ({ dispatch }) => (name, value) => {
      dispatch(cssPropertyChanged(name, value));
    },
    onPropertyChangeComplete: ({ dispatch }) => (name, value) => {
      dispatch(cssPropertyChangeCompleted(name, value));
    }
  }),
  (Base: React.ComponentClass<BaseTypographProps>) => ({
    selectedNodes,
    onPropertyChange,
    onPropertyChangeComplete,
    fontFamilies
  }: InnerProps) => {
    const node = selectedNodes[0];
    return (
      <Base
        familyInputProps={{
          options: getFontFamilyOptions(fontFamilies),
          value: node.style["font-family"],
          onChange: propertyChangeCallback("font-family", onPropertyChange),
          onChangeComplete: propertyChangeCallback(
            "font-family",
            onPropertyChangeComplete
          )
        }}
        weightInputProps={{
          options: FONT_WEIGHTS,
          value: node.style["font-weight"],
          onChange: propertyChangeCallback("font-weight", onPropertyChange),
          onChangeComplete: propertyChangeCallback(
            "font-weight",
            onPropertyChangeComplete
          )
        }}
        decorationInputProps={{
          options: FONT_WEIGHTS,
          value: node.style["text-decoration"],
          onChange: propertyChangeCallback("text-decoration", onPropertyChange),
          onChangeComplete: propertyChangeCallback(
            "text-decoration",
            onPropertyChangeComplete
          )
        }}
        // lineInputProps={{
        //   options: FONT_WEIGHTS,
        //   value: node.style["line-height"],
        //   onChange: propertyChangeCallback("line-height", onPropertyChange),
        //   onChangeComplete: propertyChangeCallback(
        //     "line-height",
        //     onPropertyChangeComplete
        //   )
        // }}
        // spacingInputProps={{
        //   options: FONT_WEIGHTS,
        //   value: node.style["letter-spacing"],
        //   onChange: propertyChangeCallback("letter-spacing", onPropertyChange),
        //   onChangeComplete: propertyChangeCallback(
        //     "letter-spacing",
        //     onPropertyChangeComplete
        //   )
        // }}
        alignmentInputProps={{
          options: ALIGNMENTS,
          value: node.style["text-align"],
          onChange: propertyChangeCallback("text-align", onPropertyChange)
        }}
        // sizeInputProps={{
        //   options: FONT_FAMILIES,
        //   value: node.style["font-size"],
        //   onChange: propertyChangeCallback("font-size", onPropertyChange),
        //   onChangeComplete: propertyChangeCallback(
        //     "font-size",
        //     onPropertyChangeComplete
        //   )
        // }}
        colorInputProps={{
          value: node.style.color,
          onChange: propertyChangeCallback("color", onPropertyChange),
          onChangeComplete: propertyChangeCallback(
            "color",
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
