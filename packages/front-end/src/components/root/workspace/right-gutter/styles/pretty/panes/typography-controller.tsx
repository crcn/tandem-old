import * as React from "react";
import { memoize, KeyValue } from "tandem-common";
import { ButtonBarOption } from "../../../../../../inputs/button-bar/controller";
import {
  DropdownMenuOption,
  mapVariablesToDropdownOptions,
  dropdownMenuOptionFromValue,
  NO_OPTION
} from "../../../../../../inputs/dropdown/controller";
import {
  cssPropertyChangeCompleted,
  cssPropertyChanged
} from "../../../../../../../actions";
import { FontFamily } from "../../../../../../../state";
import { BaseTypographProps } from "./typography.pc";
import { Dispatch } from "redux";
import {
  SyntheticElement,
  PCVariable,
  filterVariablesByType,
  PCVariableType,
  PCVisibleNode,
  PCOverride,
  InspectorNode
} from "paperclip";
import {
  ComputedStyleInfo,
  mapPCVariablesToColorSwatchOptions
} from "../../state";
import { mapVariablesToCSSVarDropdownOptions } from "./utils";
const {
  TextLeftIcon,
  TextCenterIcon,
  TextJustifyIcon,
  TextRightIcon
} = require("../../../../../../../icons/view.pc");

export const getFontFamilyOptions = memoize((fontFamiles: FontFamily[]) =>
  fontFamiles
    .map(family => ({ label: family.name, value: family.name }))
    .sort((a, b) => (a.label > b.label ? 1 : -1))
);

const FONT_WEIGHTS: DropdownMenuOption[] = [
  undefined,
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800"
].map(dropdownMenuOptionFromValue);

const DECORATIONS: DropdownMenuOption[] = [
  undefined,
  "underline",
  "overline",
  "line-through"
].map(dropdownMenuOptionFromValue);

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
  computedStyleInfo: ComputedStyleInfo;
  fontFamilies: FontFamily[];
  globalVariables: PCVariable[];
};

export default (Base: React.ComponentClass<BaseTypographProps>) =>
  class TypographyController extends React.PureComponent<Props> {
    onPropertyChange = (name, value) => {
      this.props.dispatch(cssPropertyChanged(name, value));
    };

    onPropertyChangeComplete = (name, value) => {
      this.props.dispatch(cssPropertyChangeCompleted(name, value));
    };

    render() {
      const { onPropertyChange, onPropertyChangeComplete } = this;
      const { fontFamilies, globalVariables, computedStyleInfo } = this.props;
      const fontVariables = filterVariablesByType(
        globalVariables,
        PCVariableType.FONT
      );
      return (
        <Base
          familyInputProps={{
            options: [
              NO_OPTION,
              ...mapVariablesToCSSVarDropdownOptions(fontVariables),
              ...getFontFamilyOptions(fontFamilies)
            ],
            value: computedStyleInfo.style["font-family"],
            onChange: propertyChangeCallback("font-family", onPropertyChange),
            onChangeComplete: propertyChangeCallback(
              "font-family",
              onPropertyChangeComplete
            )
          }}
          weightInputProps={{
            options: FONT_WEIGHTS,
            value: computedStyleInfo.style["font-weight"],
            onChange: propertyChangeCallback("font-weight", onPropertyChange),
            onChangeComplete: propertyChangeCallback(
              "font-weight",
              onPropertyChangeComplete
            )
          }}
          decorationInputProps={{
            options: DECORATIONS,
            value: computedStyleInfo.style["text-decoration"],
            onChange: propertyChangeCallback(
              "text-decoration",
              onPropertyChange
            ),
            onChangeComplete: propertyChangeCallback(
              "text-decoration",
              onPropertyChangeComplete
            )
          }}
          lineInputProps={{
            value: computedStyleInfo.style["line-height"],
            onChange: propertyChangeCallback("line-height", onPropertyChange),
            onChangeComplete: propertyChangeCallback(
              "line-height",
              onPropertyChangeComplete
            )
          }}
          spacingInputProps={{
            value: computedStyleInfo.style["letter-spacing"],
            onChange: propertyChangeCallback(
              "letter-spacing",
              onPropertyChange
            ),
            onChangeComplete: propertyChangeCallback(
              "letter-spacing",
              onPropertyChangeComplete
            )
          }}
          alignmentInputProps={{
            options: ALIGNMENTS,
            value: computedStyleInfo.style["text-align"],
            onChange: propertyChangeCallback("text-align", onPropertyChange)
          }}
          sizeInputProps={{
            value: computedStyleInfo.style["font-size"],
            onChange: propertyChangeCallback("font-size", onPropertyChange),
            onChangeComplete: propertyChangeCallback(
              "font-size",
              onPropertyChangeComplete
            )
          }}
          colorInputProps={{
            swatchOptions: mapPCVariablesToColorSwatchOptions(globalVariables),
            value: computedStyleInfo.style.color,
            onChange: propertyChangeCallback("color", onPropertyChange),
            onChangeComplete: propertyChangeCallback(
              "color",
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
