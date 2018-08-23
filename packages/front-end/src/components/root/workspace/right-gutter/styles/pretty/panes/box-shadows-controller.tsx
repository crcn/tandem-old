import * as React from "react";
import * as cx from "classnames";
import { compose, pure, withHandlers, withState } from "recompose";
const { BoxShadowItem } = require("./box-shadow.pc");
import { BoxShadowInfo } from "./box-shadow-item-controller";
import { memoize, EMPTY_ARRAY, arraySplice } from "tandem-common";
import { cssPropertyChangeCompleted, cssPropertyChanged } from "actions";
import { BaseBoxShadowsProps } from "./box-shadows.pc";
import { Dispatch } from "redux";
import { SyntheticElement } from "paperclip";

export type Props = {
  inset?: Boolean;
  value?: string;
  dispatch: Dispatch<any>;
  selectedNodes: SyntheticElement[];
};

export type InnerProps = {
  selectedBoxShadowIndex: any;
  onAddButtonClick: any;
  onRemoveButtonClick: any;
  onItemClick: any;
  onChange: any;
  onChangeComplete: any;
} & Props;

export default compose<InnerProps, Props>(
  pure,
  withState("selectedBoxShadowIndex", "setSelectedBoxShadowIndex", null),
  withHandlers({
    onChange: ({ dispatch, selectedNodes }) => (item, index) => {
      const selectedNode = selectedNodes[0];
      const info = arraySplice(
        parseBoxShadows(selectedNode.style["box-shadow"]),
        index,
        1,
        item
      );
      dispatch(cssPropertyChanged("box-shadow", stringifyBoxShadowInfo(info)));
    },
    onChangeComplete: ({ dispatch, selectedNodes }) => (item, index) => {
      const selectedNode = selectedNodes[0];
      const info = arraySplice(
        parseBoxShadows(selectedNode.style["box-shadow"]),
        index,
        1,
        item
      );
      dispatch(
        cssPropertyChangeCompleted("box-shadow", stringifyBoxShadowInfo(info))
      );
    },
    onAddButtonClick: ({ inset, dispatch, selectedNodes }) => () => {
      const selectedNode = selectedNodes[0];
      const info = [
        ...parseBoxShadows(selectedNode.style["box-shadow"]),
        {
          inset,
          color: "rgba(0,0,0,1)",
          x: "0px",
          y: "0px",
          blur: "10px",
          spread: "0px"
        }
      ];
      dispatch(
        cssPropertyChangeCompleted("box-shadow", stringifyBoxShadowInfo(info))
      );
    },
    onRemoveButtonClick: ({
      selectedBoxShadowIndex,
      setSelectedBoxShadowIndex,
      selectedNodes,
      dispatch
    }) => () => {
      console.log(selectedBoxShadowIndex);
      const selectedNode = selectedNodes[0];
      const info = arraySplice(
        parseBoxShadows(selectedNode.style["box-shadow"]),
        selectedBoxShadowIndex,
        1
      );
      dispatch(
        cssPropertyChangeCompleted("box-shadow", stringifyBoxShadowInfo(info))
      );
      setSelectedBoxShadowIndex(null);
    },
    onItemClick: ({
      setSelectedBoxShadowIndex,
      selectedBoxShadowIndex
    }) => index => {
      setSelectedBoxShadowIndex(
        index === selectedBoxShadowIndex ? null : index
      );
    }
  }),
  (Base: React.ComponentClass<BaseBoxShadowsProps>) => ({
    selectedNodes,
    selectedBoxShadowIndex,
    onAddButtonClick,
    onRemoveButtonClick,
    onItemClick,
    onChange,
    onChangeComplete,
    inset,
    value
  }) => {
    if (!selectedNodes || selectedNodes.length === 0) {
      return null;
    }

    const selectedNode = selectedNodes[0];
    const boxShadowInfo = parseBoxShadows(selectedNode.style["box-shadow"]);
    const hasSelectedShadow = selectedBoxShadowIndex != null;

    const items = boxShadowInfo
      .map((info, index) => {
        return info.inset === Boolean(inset) ? (
          <BoxShadowItem
            selected={index === selectedBoxShadowIndex}
            key={index}
            value={info}
            onBackgroundClick={() => onItemClick(index)}
            onChange={value => onChange(value, index)}
            onChangeComplete={value => onChangeComplete(value, index)}
          />
        ) : null;
      })
      .filter(Boolean);
    const hasItems = Boolean(items.length);

    return (
      <Base
        variant={cx({ hasItems, hasSelectedShadow })}
        addButtonProps={{ onClick: onAddButtonClick }}
        removeButtonProps={{ onClick: onRemoveButtonClick }}
        itemsProps={{ children: items }}
      />
    );
  }
);

const stringifyBoxShadowInfo = (value: BoxShadowInfo[]) =>
  value
    .map(({ inset, color, x, y, blur, spread }) => {
      return `${inset ? "inset " : ""} ${x || 0} ${y || 0} ${blur ||
        0} ${spread || 0} ${color}`;
    })
    .join(", ");

const parseBoxShadows = memoize(
  (value: string = ""): BoxShadowInfo[] => {
    return (
      value.match(/(inset\s+)?((-?\d+\w*)\s*)*((rgba|hsl)\(.*?\)|#[\d\w]+)/g) ||
      EMPTY_ARRAY
    )
      .map(shadow => {
        const inset = shadow.indexOf("inset") !== -1;
        const [x, y, blur, spread, color] = shadow
          .replace(/inset\s*/, "")
          .trim()
          .split(" ");
        console.log(shadow);
        return {
          inset: Boolean(inset),
          x,
          y,
          blur,
          spread,
          color
        };
      })
      .filter(Boolean);
  }
);
