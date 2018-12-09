import * as React from "react";
import * as cx from "classnames";
import {
  cssPropertyChangeCompleted,
  cssPropertyChanged
} from "../../../../../../../actions";
import { arraySplice } from "tandem-common";
import { Dispatch } from "redux";
import { PCVariable, isTextLikePCNode, ComputedStyleInfo } from "paperclip";
import { BaseBackgroundsProps } from "./backgrounds.pc";
import { computeCSSBackgrounds } from "./inputs/background/state";
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
      const value = this.props.computedStyleInfo.style["background-image"];
      this.props.dispatch(
        cssPropertyChanged(
          "background-image",
          replaceBackground(value, item, index)
        )
      );
    };
    onChangeComplete = (item, index) => {
      const value = this.props.computedStyleInfo.style["background-image"];
      this.props.dispatch(
        cssPropertyChangeCompleted(
          "background-image",
          replaceBackground(value, item, index)
        )
      );
    };
    onPlusButtonClick = () => {
      const value = this.props.computedStyleInfo.style["background-image"];
      this.props.dispatch(
        cssPropertyChangeCompleted(
          "background-image",
          value
            ? value +
              "," +
              `linear-gradient(${DEFAULT_COLOR}, ${DEFAULT_COLOR})`
            : `linear-gradient(${DEFAULT_COLOR}, ${DEFAULT_COLOR})`
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

      const backgrounds = computeCSSBackgrounds(computedStyleInfo);

      const children = backgrounds.map((background, i) => {
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
      });
      return (
        <Base
          variant={cx({
            hasBackground: Boolean(children.length)
          })}
          contentProps={{ children }}
          plusButtonProps={{ onClick: onPlusButtonClick }}
        />
      );
    }
  };

const splitBackgrounds = value =>
  (value || "").match(/(\w+\(.*?\)|[\w-]+|#[^,]+)/g) || [];

// TODO - validation here
const replaceBackground = (oldValue, replacement, index) =>
  arraySplice(splitBackgrounds(oldValue), index, 1, replacement)
    .filter(v => Boolean(v && v.trim()))
    .join(",") || undefined;
