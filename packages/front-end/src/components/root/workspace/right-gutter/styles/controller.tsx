import * as React from "react";
import * as cx from "classnames";
import { BaseStylesProps } from "./view.pc";
import { Dispatch } from "redux";
import {
  getPCNode,
  PCVariant,
  DependencyGraph,
  InspectorNode,
  PCVariable,
  computeStyleInfo,
  getInspectorContentNode,
  isComponent
} from "paperclip";
import { FontFamily, ProjectOptions } from "../../../../../state";

export type Props = {
  visible: boolean;
  documentColors: string[];
  projectOptions: ProjectOptions;
  dispatch: Dispatch<any>;
  rootInspectorNode: InspectorNode;
  selectedInspectorNodes: InspectorNode[];
  selectedVariant: PCVariant;
  fontFamilies: FontFamily[];
  globalVariables: PCVariable[];
  graph: DependencyGraph;
} & BaseStylesProps;

enum Tab {
  PROPERTIES,
  TRIGGERS
}

export type State = {
  tab: Tab;
};

export default (Base: React.ComponentClass<BaseStylesProps>) =>
  class RightGutterController extends React.PureComponent<Props, State> {
    state = {
      tab: Tab.PROPERTIES
    };
    onTriggersTabClick = () => {
      this.setState({
        tab: Tab.TRIGGERS
      });
    };
    onPropertiesTabClick = () => {
      this.setState({
        tab: Tab.PROPERTIES
      });
    };
    render() {
      const {
        visible,
        globalVariables,
        dispatch,
        selectedVariant,
        fontFamilies,
        graph,
        projectOptions,
        selectedInspectorNodes,
        rootInspectorNode,
        documentColors,
        ...rest
      } = this.props;
      const { onTriggersTabClick, onPropertiesTabClick } = this;
      const { tab } = this.state;
      if (!selectedInspectorNodes.length || !visible) {
        return null;
      }

      if (!getPCNode(selectedInspectorNodes[0].sourceNodeId, graph)) {
        return null;
      }
      const computedStyleInfo = computeStyleInfo(
        selectedInspectorNodes[0],
        rootInspectorNode,
        selectedVariant,
        graph
      );

      const contentNode = getInspectorContentNode(
        selectedInspectorNodes[0],
        rootInspectorNode
      );
      const contentSourceNode = getPCNode(contentNode.sourceNodeId, graph);

      return (
        <Base
          {...rest}
          variant={cx({
            propertiesTab: tab === Tab.PROPERTIES,
            triggersTab: tab === Tab.TRIGGERS,
            showPropertiesTab: Boolean(
              contentSourceNode && isComponent(contentSourceNode)
            )
          })}
          propertiesTabButonProps={{
            onClick: onPropertiesTabClick
          }}
          triggersTabButtonProps={{
            onClick: onTriggersTabClick
          }}
          propertiesProps={{
            projectOptions,
            globalVariables,
            selectedVariant,
            dispatch,
            documentColors,
            computedStyleInfo,
            selectedInspectorNodes,
            rootInspectorNode,
            graph,
            fontFamilies
          }}
          styleSwitcherProps={{
            dispatch,
            rootInspectorNode,
            selectedInspectorNodes,
            graph,
            selectedVariant
          }}
        />
      );
    }
  };
