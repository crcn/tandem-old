import * as React from "react";
import { BaseStylesProps } from "./view.pc";
import { Dispatch } from "redux";
import {
  getPCNode,
  PCVariant,
  DependencyGraph,
  InspectorNode,
  PCVariable,
  computeStyleInfo
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

export default (Base: React.ComponentClass<BaseStylesProps>) =>
  class RightGutterController extends React.PureComponent<Props> {
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
      return (
        <Base
          variantsProps={{
            dispatch,
            rootInspectorNode,
            selectedInspectorNodes,
            selectedVariant,
            graph
          }}
          prettyProps={{
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
          {...rest}
        />
      );
    }
  };
