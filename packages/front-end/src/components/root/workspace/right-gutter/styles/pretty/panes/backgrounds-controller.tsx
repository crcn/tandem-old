import * as React from "react";
import {
  cssPropertyChangeCompleted,
  cssPropertyChanged
} from "../../../../../../../actions";
import { arraySplice } from "tandem-common";
import { Dispatch } from "redux";
import {
  SyntheticElement,
  PCVariable,
  PCSourceTagNames,
  isTextLikePCNode,
  ComputedStyleInfo
} from "paperclip";
import { BaseBackgroundsProps } from "./backgrounds.pc";
import { BackgroundItem } from "./backgrounds.pc";

const DEFAULT_COLOR = "rgba(200, 200, 200, 1)";

export type Props = {
  documentColors: string[];
  dispatch: Dispatch;
  computedStyleInfo: ComputedStyleInfo;
  globalVariables: PCVariable[];
};

export default (Base: React.ComponentClass<BaseBackgroundsProps>) =>
  class BackgroundsController extends React.PureComponent<Props> {
    onChange = (item, index) => {
      const value = this.props.computedStyleInfo.style.background;
      this.props.dispatch(
        cssPropertyChanged("background", replaceBackground(value, item, index))
      );
    };
    onChangeComplete = (item, index) => {
      const value = this.props.computedStyleInfo.style.background;
      this.props.dispatch(
        cssPropertyChangeCompleted(
          "background",
          replaceBackground(value, item, index)
        )
      );
    };
    onPlusButtonClick = () => {
      const value = this.props.computedStyleInfo.style.background;
      this.props.dispatch(
        cssPropertyChangeCompleted(
          "background",
          value ? value + "," + DEFAULT_COLOR : DEFAULT_COLOR
        )
      );
    };
    render() {
      const { computedStyleInfo, documentColors, globalVariables } = this.props;
      const { onChange, onChangeComplete, onPlusButtonClick } = this;

      const { sourceNode } = computedStyleInfo;

      // Typography pane is only available to text nodes to prevent cascading styles
      if (isTextLikePCNode(sourceNode)) {
        return null;
      }

      const children = splitBackgrounds(computedStyleInfo.style.background).map(
        (background, i) => {
          return (
            <BackgroundItem
              key={i}
              value={background}
              globalVariables={globalVariables}
              onChange={value => onChange(value, i)}
              onChangeComplete={value => onChangeComplete(value, i)}
              documentColors={documentColors}
            />
          );
        }
      );
      return (
        <Base
          contentProps={{ children }}
          plusButtonProps={{ onClick: onPlusButtonClick }}
        />
      );
    }
  };

const splitBackgrounds = value =>
  (value || "").match(/(\w+\(.*?\)|[\w-]+|#[^,])/g) || [];

// TODO - validation here
const replaceBackground = (oldValue, replacement, index) =>
  arraySplice(splitBackgrounds(oldValue), index, 1, replacement)
    .filter(v => Boolean(v && v.trim()))
    .join(",") || undefined;
