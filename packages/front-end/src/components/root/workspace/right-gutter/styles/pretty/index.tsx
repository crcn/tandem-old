import * as React from "react";
import {
  SyntheticNode,
  DependencyGraph,
  InspectorNode,
  PCVariant,
  PCVariable,
  ComputedStyleInfo
} from "paperclip";
import { BaseElementStylerProps } from "./view.pc";
import { Dispatch } from "redux";
import { FontFamily, ProjectOptions } from "../../../../../../state";

export type PrettyPaneOuterProps = {
  syntheticNodes: SyntheticNode[];
};

export type Props = {
  cwd: string;
  documentColors: string[];
  selectedVariant: PCVariant;
  dispatch: Dispatch<any>;
  graph: DependencyGraph;
  computedStyleInfo: ComputedStyleInfo;
  rootInspectorNode: InspectorNode;
  selectedInspectorNodes: InspectorNode[];
  fontFamilies: FontFamily[];
  globalVariables: PCVariable[];
  projectOptions: ProjectOptions;
};

export default (Base: React.ComponentClass<BaseElementStylerProps>) =>
  class PrettyStylesController extends React.PureComponent<Props> {
    render() {
      const {
        cwd,
        dispatch,
        selectedVariant,
        computedStyleInfo,
        globalVariables,
        fontFamilies,
        documentColors,
        projectOptions,
        graph,
        selectedInspectorNodes,
        rootInspectorNode,
        ...rest
      } = this.props;
      return (
        <Base
          {...rest}
          instancePaneProps={{
            computedStyleInfo,
            selectedInspectorNodes,
            rootInspectorNode,
            dispatch,
            graph,
            selectedVariant
          }}
          layoutPaneProps={{
            dispatch,
            graph,
            selectedVariant,
            rootInspectorNode,
            computedStyleInfo,
            selectedInspectorNodes
          }}
          typographyPaneProps={{
            dispatch,
            computedStyleInfo,
            fontFamilies,
            documentColors,
            graph,
            globalVariables,
            projectOptions
          }}
          opacityPaneProps={{
            dispatch,
            computedStyleInfo
          }}
          mixinsPaneProps={{
            dispatch,
            selectedInspectorNodes,
            graph,
            projectOptions
          }}
          bordersPaneProps={{
            dispatch,
            documentColors,
            computedStyleInfo,
            globalVariables
          }}
          outerShadowsPaneProps={{
            dispatch,
            documentColors,
            computedStyleInfo,
            globalVariables
          }}
          spacingPaneProps={{
            dispatch,
            computedStyleInfo
          }}
          backgroundsPaneProps={{
            dispatch,
            documentColors,
            computedStyleInfo,
            globalVariables,
            cwd
          }}
          innerShadowsPaneProps={{
            dispatch,
            documentColors,
            computedStyleInfo,
            globalVariables
          }}
          customCodePaneProps={{
            dispatch,
            computedStyleInfo
          }}
        />
      );
    }
  };
