import * as React from "react";
import {
  cssPropertyChangeCompleted,
  cssPropertyChanged
} from "../../../../../../../actions";
import { arraySplice } from "tandem-common";
import { Dispatch } from "redux";
import { SyntheticElement, PCVariable } from "paperclip";
import { BaseBackgroundsProps } from "./backgrounds.pc";
import { BackgroundItem } from "./backgrounds.pc";

const DEFAULT_COLOR = "rgba(200, 200, 200, 1)";

export type Props = {
  dispatch: Dispatch;
  globalVariables: PCVariable[];
  selectedNodes: SyntheticElement[];
};

type InnerProps = {
  onChange: any;
  onChangeComplete: any;
  onPlusButtonClick: any;
} & Props;

export default (Base: React.ComponentClass<BaseBackgroundsProps>) =>
  class BackgroundsController extends React.PureComponent<Props> {
    onChange = (item, index) => {
      const node = this.props.selectedNodes[0];
      const value = node.style.background;
      this.props.dispatch(
        cssPropertyChanged("background", replaceBackground(value, item, index))
      );
    };
    onChangeComplete = (item, index) => {
      const node = this.props.selectedNodes[0];
      const value = node.style.background;
      this.props.dispatch(
        cssPropertyChangeCompleted(
          "background",
          replaceBackground(value, item, index)
        )
      );
    };
    onPlusButtonClick = () => {
      const node = this.props.selectedNodes[0];
      const value = node.style.background;
      this.props.dispatch(
        cssPropertyChangeCompleted(
          "background",
          value ? value + "," + DEFAULT_COLOR : DEFAULT_COLOR
        )
      );
    };
    render() {
      const { selectedNodes, globalVariables } = this.props;
      const { onChange, onChangeComplete, onPlusButtonClick } = this;

      const node = selectedNodes[0];
      const children = splitBackgrounds(node.style.background).map(
        (background, i) => {
          return (
            <BackgroundItem
              key={i}
              value={background}
              onChange={value => onChange(value, i)}
              onChangeComplete={value => onChangeComplete(value, i)}
              globalVariables={globalVariables}
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
  (value || "").match(/(rgba\(.*?\)|\w+|#[^,])/g) || [];

// TODO - validation here
const replaceBackground = (oldValue, replacement, index) =>
  arraySplice(splitBackgrounds(oldValue), index, 1, replacement)
    .filter(v => Boolean(v.trim()))
    .join(",") || undefined;
