import * as React from "react";
import { compose, pure, withHandlers } from "recompose";
import { DropdownMenuItem } from "../../../../../../inputs/dropdown/controller";
import { ButtonBarOption } from "../../../../../../inputs/button-bar/controller";
import { cssPropertyChanged } from "actions";
import { PCSourceTagNames } from "paperclip";

const FONT_FAMILIES: DropdownMenuItem[] = ["Helvetica", "Roboto"].map(
  value => ({ label: value, value })
);

const FONT_WEIGHTS: DropdownMenuItem[] = ["100", "200", "300", "400"].map(
  value => ({ label: value, value })
);

const DECORATIONS: DropdownMenuItem[] = [
  "underline",
  "overline",
  "line-through"
].map(value => ({ label: value, value }));

const ALIGNMENTS: ButtonBarOption[] = [
  {
    value: "left",
    iconSrc: require("../../../../../../../icons/text-left.svg")
  },
  {
    value: "center",
    iconSrc: require("../../../../../../../icons/text-center.svg")
  },
  {
    value: "justify",
    iconSrc: require("../../../../../../../icons/text-justify.svg")
  },
  {
    value: "right",
    iconSrc: require("../../../../../../../icons/text-right.svg")
  }
];

export default compose(
  pure,
  withHandlers({
    onFamilyChange: ({ dispatch }) => value => {
      dispatch(cssPropertyChanged("font-family", value));
    },
    onWeightChange: ({ dispatch }) => value => {
      dispatch(cssPropertyChanged("font-weight", value));
    },
    onDecorationChange: ({ dispatch }) => value => {
      dispatch(cssPropertyChanged("text-decoration", value));
    },
    onLineChange: ({ dispatch }) => value => {
      dispatch(cssPropertyChanged("line-height", value));
    },
    onSpacingChange: ({ dispatch }) => value => {
      dispatch(cssPropertyChanged("letter-spacing", value));
    },
    onSizeChange: ({ dispatch }) => value => {
      dispatch(cssPropertyChanged("font-size", value));
    },
    onColorChange: ({ dispatch }) => value => {
      dispatch(cssPropertyChanged("color", value));
    },
    onAlignmentChange: ({ dispatch }) => value => {
      dispatch(cssPropertyChanged("text-alignment", value));
    }
  }),
  Base => ({
    selectedNodes,
    onFamilyChange,
    onWeightChange,
    onDecorationChange,
    onSizeChange,
    onColorChange,
    onAlignmentChange,
    onLineChange,
    onSpacingChange
  }) => {
    const node = selectedNodes[0];
    return (
      <Base
        familyInputProps={{
          options: FONT_FAMILIES,
          value: node.style["font-family"],
          onChange: onFamilyChange
        }}
        weightInputProps={{
          options: FONT_WEIGHTS,
          value: node.style["font-weight"],
          onChange: onWeightChange
        }}
        decorationInputProps={{
          options: FONT_WEIGHTS,
          value: node.style["text-decoration"],
          onChange: onDecorationChange
        }}
        lineInputProps={{
          options: FONT_WEIGHTS,
          value: node.style["line-height"],
          onChange: onLineChange
        }}
        spacingInputProps={{
          options: FONT_WEIGHTS,
          value: node.style["letter-spacing"],
          onChange: onSpacingChange
        }}
        alignmentInputProps={{
          options: ALIGNMENTS,
          value: node.style["text-alignment"],
          onChange: onAlignmentChange
        }}
        sizeInputProps={{
          options: FONT_FAMILIES,
          value: node.style["font-size"],
          onChange: onSizeChange
        }}
        colorInputProps={{
          options: FONT_FAMILIES,
          value: node.style.color,
          onChange: onColorChange
        }}
      />
    );
  }
);
