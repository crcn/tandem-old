import * as React from "react";
import { BaseInstancePaneProps } from "./instance.pc";
import { Dispatch } from "redux";
import * as cx from "classnames";
import {
  SyntheticDocument,
  SyntheticNode,
  DependencyGraph,
  PCVariant,
  InspectorNode,
  getSyntheticSourceNode,
  PCSourceTagNames,
  extendsComponent,
  getInspectorSourceNode,
  inspectorNodeInShadow,
  getInspectorNodeParentShadow,
  getInspectorInstanceShadowContentNode,
  getTopMostInspectorInstance
} from "paperclip";
import { ComputedStyleInfo } from "../../state";
import { dropdownMenuOptionFromValue } from "../../../../../../inputs/dropdown/controller";
import { cssResetPropertyOptionClicked } from "../../../../../../../actions";
import { getParentTreeNode, containsNestedTreeNodeById } from "tandem-common";

export type Props = {
  selectedInspectorNodes: InspectorNode[];
  rootInspectorNode: InspectorNode;
  syntheticDocument: SyntheticDocument;
  dispatch: Dispatch<any>;
  graph: DependencyGraph;
  selectedVariant: PCVariant;
  computedStyleInfo: ComputedStyleInfo;
};

export default (Base: React.ComponentClass<BaseInstancePaneProps>) =>
  class InstancePaneController extends React.PureComponent<Props> {
    onResetStyle = (property: string) => {
      this.props.dispatch(cssResetPropertyOptionClicked(property));
    };
    render() {
      const { onResetStyle } = this;
      const {
        syntheticDocument,
        selectedInspectorNodes,
        computedStyleInfo,
        rootInspectorNode,
        selectedVariant,
        dispatch,
        graph,
        ...rest
      } = this.props;
      const selectedInspectorNode = selectedInspectorNodes[0];
      if (!selectedInspectorNode) {
        return null;
      }

      const sourceNode = getInspectorSourceNode(
        selectedInspectorNode,
        rootInspectorNode,
        graph
      );

      if (
        sourceNode.name !== PCSourceTagNames.COMPONENT_INSTANCE &&
        (sourceNode.name !== PCSourceTagNames.COMPONENT ||
          !extendsComponent(sourceNode))
      ) {
        if (!inspectorNodeInShadow(selectedInspectorNode, rootInspectorNode)) {
          return null;
        }
      }

      const instance = getTopMostInspectorInstance(
        selectedInspectorNode,
        rootInspectorNode
      );
      const instanceSourceNode = getInspectorSourceNode(
        instance,
        rootInspectorNode,
        graph
      );

      const overrideKeys = Object.keys(
        computedStyleInfo.styleOverridesMap
      ).filter(key => {
        const overrides = computedStyleInfo.styleOverridesMap[key];

        const inCurrentShadow = overrides.some(override =>
          containsNestedTreeNodeById(override.id, instanceSourceNode)
        );
        return inCurrentShadow;
      });

      return (
        <Base
          {...rest}
          variant={cx({
            hasOverrides: overrideKeys.length > 0
          })}
          resetDropdownProps={{
            options: overrideKeys.map(dropdownMenuOptionFromValue),
            onChangeComplete: onResetStyle
          }}
          variantInputProps={{
            sourceNode,
            selectedVariant,
            selectedInspectorNode,
            rootInspectorNode,
            dispatch,
            graph
          }}
        />
      );
    }
  };
