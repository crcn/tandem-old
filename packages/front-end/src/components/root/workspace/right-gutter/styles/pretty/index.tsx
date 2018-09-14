import * as React from "react";
import {
  SyntheticNode,
  SyntheticElement,
  DependencyGraph,
  InspectorNode,
  SyntheticDocument,
  PCVariant
} from "paperclip";
import { BaseElementStylerProps } from "./index.pc";
import { Dispatch } from "redux";
import { FontFamily } from "../../../../../../state";

export type PrettyPaneOuterProps = {
  syntheticNodes: SyntheticNode[];
};

export type Props = {
  selectedVariant: PCVariant;
  dispatch: Dispatch<any>;
  selectedNodes: SyntheticElement[];
  graph: DependencyGraph;
  rootInspectorNode: InspectorNode;
  selectedInspectorNodes: InspectorNode[];
  syntheticDocument: SyntheticDocument;
  fontFamilies: FontFamily[];
};

export default (Base: React.ComponentClass<BaseElementStylerProps>) =>
  class PrettyStylesController extends React.PureComponent<Props> {
    render() {
      const props = this.props;
      return (
        <Base
          {...props}
          instancePaneProps={props}
          inheritPaneProps={props}
          codePaneProps={props}
          layoutPaneProps={props}
          typographyPaneProps={props}
          opacityPaneProps={props}
          backgroundsPaneProps={props}
          spacingPaneProps={props}
          bordersPaneProps={props}
          outerShadowsPaneProps={props}
          innerShadowsPaneProps={props}
        />
      );
    }
  };
