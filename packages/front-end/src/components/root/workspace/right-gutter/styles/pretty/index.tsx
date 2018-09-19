import * as React from "react";
import {
  SyntheticNode,
  SyntheticElement,
  DependencyGraph,
  InspectorNode,
  SyntheticDocument,
  PCVariant,
  PCVariable
} from "paperclip";
import { BaseElementStylerProps } from "./index.pc";
import { Dispatch } from "redux";
import { FontFamily } from "../../../../../../state";
import { ComputedStyleInfo } from "../state";

export type PrettyPaneOuterProps = {
  syntheticNodes: SyntheticNode[];
};

export type Props = {
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
        selectedNodes,
        syntheticDocument,
        graph,
        selectedInspectorNodes,
        rootInspectorNode,
        ...rest
      } = this.props;
      return (
        <Base
          {...rest}
          instancePaneProps={{
            selectedInspectorNodes,
            rootInspectorNode,
            syntheticDocument,
            selectedNodes,
            dispatch,
            graph,
            selectedVariant
          }}
          inheritPaneProps={{
            dispatch,
            selectedNodes,
            graph
          }}
          codePaneProps={{
            dispatch,
            selectedNodes
          }}
          layoutPaneProps={{
            dispatch,
            selectedNodes,
            syntheticDocument,
            graph
          }}
          typographyPaneProps={{
            dispatch,
            selectedNodes,
            computedStyleInfo,
            fontFamilies,
            globalVariables
          }}
          opacityPaneProps={{
            dispatch,
            selectedNodes
          }}
          backgroundsPaneProps={{
            globalVariables,
            dispatch,
            selectedNodes
          }}
          spacingPaneProps={{
            dispatch,
            selectedNodes
          }}
          bordersPaneProps={{
            globalVariables,
            dispatch,
            selectedNodes
          }}
          outerShadowsPaneProps={{
            globalVariables,
            dispatch,
            selectedNodes
          }}
          innerShadowsPaneProps={{
            globalVariables,
            dispatch,
            selectedNodes
          }}
        />
      );
    }
  };
