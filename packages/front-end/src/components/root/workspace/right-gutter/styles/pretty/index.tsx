import * as React from "react";
import { compose, pure } from "recompose";
import {
  SyntheticNode,
  SyntheticElement,
  DependencyGraph,
  SyntheticDocument
} from "paperclip";
import { BaseElementStylerProps } from "./index.pc";
import { Dispatch } from "redux";
import { FontFamily } from "state";

export type PrettyPaneOuterProps = {
  syntheticNodes: SyntheticNode[];
};

export type Props = {
  dispatch: Dispatch<any>;
  selectedNodes: SyntheticElement[];
  graph: DependencyGraph;
  syntheticDocument: SyntheticDocument;
  fontFamilies: FontFamily[];
};

type InnerProps = {} & Props;

export default compose<InnerProps, Props>(
  pure,
  (Base: React.ComponentClass<BaseElementStylerProps>) => (
    props: InnerProps
  ) => {
    return (
      <Base
        {...props}
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
);
