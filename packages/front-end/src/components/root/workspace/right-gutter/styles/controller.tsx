import * as React from "react";
import { BaseStylesProps } from "./view.pc";
import { Dispatch } from "redux";
import {
  SyntheticDocument,
  SyntheticElement,
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
  syntheticDocument: SyntheticDocument;
  selectedNodes: SyntheticElement[];
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
        syntheticDocument,
        selectedNodes,
        selectedVariant,
        fontFamilies,
        graph,
        projectOptions,
        selectedInspectorNodes,
        rootInspectorNode,
        documentColors,
        ...rest
      } = this.props;
      if (!selectedInspectorNodes.length || !selectedNodes.length || !visible) {
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
            syntheticDocument,
            selectedNodes,
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
            syntheticDocument,
            selectedNodes,
            graph,
            fontFamilies
          }}
          styleSwitcherProps={{
            dispatch,
            syntheticDocument,
            selectedNodes,
            graph,
            selectedVariant
          }}
          {...rest}
        />
      );
    }
  };
