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
          mixinsProps={{
            dispatch,
            selectedInspectorNodes,
            graph,
            projectOptions
          }}
          styleInspectorProps={{
            dispatch,
            computedStyleInfo
          }}
        />
      );
    }
  };
