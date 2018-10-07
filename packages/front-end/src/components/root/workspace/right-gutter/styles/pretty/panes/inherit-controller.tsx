import * as React from "react";
import * as cx from "classnames";
import { Dispatch } from "redux";
import { EMPTY_OBJECT } from "tandem-common";
import { InheritItem } from "./inherit-item.pc";
import {
  getSyntheticSourceNode,
  DependencyGraph,
  getPCNode,
  SyntheticElement,
  PCVisibleNode,
  getAllStyleMixins,
  PCSourceTagNames,
  PCComponent,
  PCStyleMixin,
  isElementLikePCNode,
  getNativeComponentName
} from "paperclip";
import {
  inheritPaneAddButtonClick,
  inheritPaneRemoveButtonClick
} from "../../../../../../../actions";
import { BaseInheritProps } from "./inherit.pc";
import { ProjectOptions } from "state";

export type Props = {
  dispatch: Dispatch<any>;
  selectedNodes: SyntheticElement[];
  graph: DependencyGraph;
  projectOptions: ProjectOptions;
};

type State = {
  selectedStyleMixinId: string;
};

export default (Base: React.ComponentClass<BaseInheritProps>) => {
  return class InheritController extends React.PureComponent<Props, State> {
    constructor(props) {
      super(props);
      this.state = { selectedStyleMixinId: null };
    }
    onAddButtonClick = () => {
      this.props.dispatch(inheritPaneAddButtonClick());
    };
    onRemoveButtonClick = () => {
      this.props.dispatch(
        inheritPaneRemoveButtonClick(this.state.selectedStyleMixinId)
      );
    };
    onInheritItemClick = (styleMixinId: string) => {
      this.setState({
        selectedStyleMixinId:
          this.state.selectedStyleMixinId === styleMixinId ? null : styleMixinId
      });
    };
    render() {
      const {
        onAddButtonClick,
        onRemoveButtonClick,
        onInheritItemClick
      } = this;
      const { selectedStyleMixinId } = this.state;
      const { selectedNodes, dispatch, graph, projectOptions } = this.props;
      const node = selectedNodes[0];
      const sourceNode = getSyntheticSourceNode(node, graph) as
        | PCVisibleNode
        | PCComponent
        | PCStyleMixin;

      const hasItemSelected = Boolean(selectedStyleMixinId);

      const allStyleMixins = getAllStyleMixins(
        graph,
        projectOptions.allowCascadeFonts === false
          ? isElementLikePCNode(sourceNode)
            ? getNativeComponentName(sourceNode, graph) === "input"
              ? null
              : PCSourceTagNames.ELEMENT
            : PCSourceTagNames.TEXT
          : null
      );

      const items = Object.keys(sourceNode.styleMixins || EMPTY_OBJECT)
        .filter(k => Boolean(sourceNode.styleMixins[k]))
        .sort((a, b) => {
          return sourceNode.styleMixins[a].priority >
            sourceNode.styleMixins[b].priority
            ? -1
            : 1;
        })
        .map((styleMixinId, i) => {
          return (
            <InheritItem
              alt={Boolean(i % 2)}
              key={styleMixinId}
              onClick={onInheritItemClick as any}
              selected={selectedStyleMixinId === styleMixinId}
              styleMixinId={styleMixinId}
              styleMixin={getPCNode(styleMixinId, graph) as PCStyleMixin}
              allStyleMixins={allStyleMixins}
              dispatch={dispatch}
            />
          );
        });

      return (
        <Base
          variant={cx({ hasItemSelected })}
          addButtonProps={{ onClick: onAddButtonClick }}
          removeButtonProps={{ onClick: onRemoveButtonClick }}
          items={items}
        />
      );
    }
  };
};
