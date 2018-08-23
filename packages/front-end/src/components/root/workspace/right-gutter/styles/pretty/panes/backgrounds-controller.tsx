import * as React from "react";
import { compose, pure, withHandlers } from "recompose";
import { cssPropertyChangeCompleted, cssPropertyChanged } from "actions";
import { arraySplice } from "tandem-common";
import { Dispatch } from "redux";
import { SyntheticElement } from "paperclip";
import { BaseBackgroundsProps } from "./backgrounds.pc";
const { BackgroundItem } = require("./backgrounds.pc");

const DEFAULT_COLOR = "rgba(200, 200, 200, 1)";

export type Props = {
  dispatch: Dispatch;
  selectedNodes: SyntheticElement[];
};

type InnerProps = {
  onChange: any;
  onChangeComplete: any;
  onPlusButtonClick: any;
} & Props;

export default compose<InnerProps, Props>(
  pure,
  withHandlers({
    onChange: ({ dispatch, selectedNodes }) => (item, index) => {
      const node = selectedNodes[0];
      const value = node.style.background;
      dispatch(
        cssPropertyChanged("background", replaceBackground(value, item, index))
      );
    },
    onChangeComplete: ({ dispatch, selectedNodes }) => (item, index) => {
      const node = selectedNodes[0];
      const value = node.style.background;
      dispatch(
        cssPropertyChangeCompleted(
          "background",
          replaceBackground(value, item, index)
        )
      );
    },
    onPlusButtonClick: ({ dispatch, selectedNodes, value }) => () => {
      const node = selectedNodes[0];
      const value = node.style.background;
      dispatch(
        cssPropertyChangeCompleted(
          "background",
          value ? value + "," + DEFAULT_COLOR : DEFAULT_COLOR
        )
      );
    }
  }),
  (Base: React.ComponentClass<BaseBackgroundsProps>) => ({
    onChange,
    onChangeComplete,
    onPlusButtonClick,
    selectedNodes
  }: InnerProps) => {
    const node = selectedNodes[0];
    const children = splitBackgrounds(node.style.background).map(
      (background, i) => {
        return (
          <BackgroundItem
            key={i}
            value={background}
            onChange={value => onChange(value, i)}
            onChangeComplete={value => onChangeComplete(value, i)}
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
);

const splitBackgrounds = value =>
  (value || "").match(/(rgba\(.*?\)|\w+|#[^,])/g) || [];

// TODO - validation here
const replaceBackground = (oldValue, replacement, index) =>
  arraySplice(splitBackgrounds(oldValue), index, 1, replacement)
    .filter(v => Boolean(v.trim()))
    .join(",") || undefined;
