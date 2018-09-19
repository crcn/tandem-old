import * as React from "react";
import * as cx from "classnames";
import { BoxShadowItem } from "./box-shadow.pc";
import { BoxShadowInfo } from "./box-shadow-item-controller";
import { memoize, EMPTY_ARRAY, arraySplice } from "tandem-common";
import {
  cssPropertyChangeCompleted,
  cssPropertyChanged
} from "../../../../../../../actions";
import { BaseBoxShadowsProps } from "./box-shadows.pc";
import { Dispatch } from "redux";
import { SyntheticElement, PCVariable } from "paperclip";

export type Props = {
  inset?: Boolean;
  value?: string;
  globalVariables: PCVariable[];
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

type State = {
  selectedBoxShadowIndex?: number;
};

export default (Base: React.ComponentClass<BaseBoxShadowsProps>) =>
  class BoxShadowsController extends React.PureComponent<Props, State> {
    state = {
      selectedBoxShadowIndex: null
    };
    setSelectedBoxShadowIndex = (value: number) => {
      this.setState({ ...this.state, selectedBoxShadowIndex: value });
    };

    onChange = (item, index) => {
      const { selectedNodes, dispatch } = this.props;
      const selectedNode = selectedNodes[0];
      const info = arraySplice(
        parseBoxShadows(selectedNode.style["box-shadow"]),
        index,
        1,
        item
      );
      dispatch(cssPropertyChanged("box-shadow", stringifyBoxShadowInfo(info)));
    };
    onChangeComplete = (item, index) => {
      const { selectedNodes, dispatch } = this.props;
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
    };
    onAddButtonClick = () => {
      const { selectedNodes, dispatch, inset } = this.props;
      const selectedNode = selectedNodes[0];
      const info: BoxShadowInfo[] = [
        ...parseBoxShadows(selectedNode.style["box-shadow"]),
        {
          inset: Boolean(inset),
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
    };

    onRemoveButtonClick = () => {
      const { selectedNodes, dispatch } = this.props;
      const { selectedBoxShadowIndex } = this.state;
      const { setSelectedBoxShadowIndex } = this;
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
    };
    onItemClick = index => {
      const { selectedBoxShadowIndex } = this.state;
      const { setSelectedBoxShadowIndex } = this;

      setSelectedBoxShadowIndex(
        index === selectedBoxShadowIndex ? null : index
      );
    };

    render() {
      const { globalVariables, selectedNodes, inset } = this.props;
      const { selectedBoxShadowIndex } = this.state;
      const {
        onChange,
        onItemClick,
        onChangeComplete,
        onAddButtonClick,
        onRemoveButtonClick
      } = this;

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
              globalVariables={globalVariables}
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
  };

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
        const [, , x, y, blur, spread, color] = shadow.match(
          /(inset\s)?([^\s]+)\s([^\s]+)\s([^\s]+)\s([^\s]+)\s(.*)/
        );
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
