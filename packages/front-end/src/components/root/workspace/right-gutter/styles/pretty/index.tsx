import * as React from "react";
import {
  SyntheticNode,
  SyntheticElement,
  DependencyGraph,
  InspectorNode,
  SyntheticDocument,
  PCVariant,
  PCVariable,
  ComputedStyleInfo,
  getSyntheticSourceNode,
  PCVisibleNode
} from "paperclip";
import { BaseElementStylerProps } from "./view.pc";
import { Dispatch } from "redux";
import { FontFamily, ProjectOptions } from "../../../../../../state";

export type PrettyPaneOuterProps = {
  syntheticNodes: SyntheticNode[];
};

export type Props = {
  documentColors: string[];
  selectedVariant: PCVariant;
  dispatch: Dispatch<any>;
  selectedNodes: SyntheticElement[];
  graph: DependencyGraph;
  computedStyleInfo: ComputedStyleInfo;
  rootInspectorNode: InspectorNode;
  selectedInspectorNodes: InspectorNode[];
  syntheticDocument: SyntheticDocument;
  fontFamilies: FontFamily[];
  globalVariables: PCVariable[];
  projectOptions: ProjectOptions;
};

export default (Base: React.ComponentClass<BaseElementStylerProps>) =>
  class PrettyStylesController extends React.PureComponent<Props> {
    render() {
      const {
        dispatch,
        selectedVariant,
        computedStyleInfo,
        globalVariables,
        fontFamilies,
        documentColors,
        selectedNodes,
        projectOptions,
        syntheticDocument,
        graph,
        selectedInspectorNodes,
        rootInspectorNode,
        ...rest
      } = this.props;
      const selectedNode = (selectedNodes.length
        ? getSyntheticSourceNode(selectedNodes[0], graph)
        : null) as PCVisibleNode;
      return (
        <Base
          {...rest}
          instancePaneProps={{
            computedStyleInfo,
            selectedInspectorNodes,
            rootInspectorNode,
            syntheticDocument,
            dispatch,
            graph,
            selectedVariant
          }}
          inheritPaneProps={{
            projectOptions,
            dispatch,
            selectedNodes,
            graph
          }}
          codePaneProps={{
            dispatch,
            computedStyleInfo
          }}
          layoutPaneProps={{
            dispatch,
            selectedVariant,
            rootInspectorNode,
            selectedInspectorNodes,
            computedStyleInfo,
            graph
          }}
          typographyPaneProps={{
            projectOptions,
            graph,
            dispatch,
            documentColors,
            computedStyleInfo,
            fontFamilies,
            globalVariables
          }}
          opacityPaneProps={{
            dispatch,
            computedStyleInfo
          }}
          backgroundsPaneProps={{
            globalVariables,
            documentColors,
            dispatch,
            computedStyleInfo
          }}
          spacingPaneProps={{
            dispatch,
            computedStyleInfo
          }}
          bordersPaneProps={{
            globalVariables,
            documentColors,
            dispatch,
            computedStyleInfo
          }}
          outerShadowsPaneProps={{
            globalVariables,
            documentColors,
            dispatch,
            computedStyleInfo
          }}
          innerShadowsPaneProps={{
            globalVariables,
            documentColors,
            dispatch,
            computedStyleInfo
          }}
        />
      );
    }
  };
