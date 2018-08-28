import * as React from "react";
import * as cx from "classnames";
import { Dispatch } from "redux";
import { EMPTY_OBJECT } from "tandem-common";
import { InheritItem } from "./inherit-item.pc";
import {
  getSyntheticSourceNode,
  DependencyGraph,
  getPCNode,
  getAllPCComponents,
  SyntheticElement,
  PCVisibleNode
} from "paperclip";
import {
  inheritPaneAddButtonClick,
  inheritPaneRemoveButtonClick
} from "../../../../../../../actions";
import { BaseInheritProps } from "./inherit.pc";

export type Props = {
  dispatch: Dispatch<any>;
  selectedNodes: SyntheticElement[];
  graph: DependencyGraph;
};

type State = {
  selectedInheritItemComponentId: string;
};

export default (Base: React.ComponentClass<BaseInheritProps>) => {
  return class InheritController extends React.PureComponent<Props, State> {
    constructor(props) {
      super(props);
      this.state = { selectedInheritItemComponentId: null };
    }
    onAddButtonClick = () => {
      this.props.dispatch(inheritPaneAddButtonClick());
    };
    onRemoveButtonClick = () => {
      this.props.dispatch(
        inheritPaneRemoveButtonClick(this.state.selectedInheritItemComponentId)
      );
    };
    onInheritItemClick = (componentId: string) => {
      this.setState({
        selectedInheritItemComponentId:
          this.state.selectedInheritItemComponentId === componentId
            ? null
            : componentId
      });
    };
    render() {
      const {
        onAddButtonClick,
        onRemoveButtonClick,
        onInheritItemClick
      } = this;
      const { selectedInheritItemComponentId } = this.state;
      const { selectedNodes, dispatch, graph } = this.props;
      const node = selectedNodes[0];
      const sourceNode = getSyntheticSourceNode(node, graph) as PCVisibleNode;

      const hasItemSelected = Boolean(selectedInheritItemComponentId);

      const allComponents = getAllPCComponents(graph);

      const items = Object.keys(sourceNode.inheritStyle || EMPTY_OBJECT)
        .filter(k => Boolean(sourceNode.inheritStyle[k]))
        .sort((a, b) => {
          return sourceNode.inheritStyle[a].priority >
            sourceNode.inheritStyle[b].priority
            ? -1
            : 1;
        })
        .map(componentId => {
          return (
            <InheritItem
              key={componentId}
              onClick={onInheritItemClick}
              selected={selectedInheritItemComponentId === componentId}
              componentId={componentId}
              component={getPCNode(componentId, graph)}
              allComponents={allComponents}
              dispatch={dispatch}
            />
          );
        });

      return (
        <Base
          variant={cx({ hasItemSelected })}
          addButtonProps={{ onClick: onAddButtonClick }}
          removeButtonProps={{ onClick: onRemoveButtonClick }}
          contentProps={{ children: items }}
        />
      );
    }
  };
};
