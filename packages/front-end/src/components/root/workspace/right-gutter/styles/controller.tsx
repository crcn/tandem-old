import * as React from "react";
import { compose, pure } from "recompose";
import { BaseStylesProps } from "./view.pc";
import { Dispatch } from "redux";
import {
  SyntheticDocument,
  SyntheticElement,
  PCVariant,
  DependencyGraph
} from "paperclip";
import { FontFamily } from "state";

export type Props = {
  dispatch: Dispatch<any>;
  syntheticDocument: SyntheticDocument;
  selectedNodes: SyntheticElement[];
  selectedVariant: PCVariant;
  fontFamilies: FontFamily[];
  graph: DependencyGraph;
} & BaseStylesProps;

export default compose(
  pure,
  (Base: React.ComponentClass<BaseStylesProps>) => ({
    dispatch,
    syntheticDocument,
    selectedNodes,
    selectedVariant,
    fontFamilies,
    graph,
    ...rest
  }) => {
    if (!selectedNodes.length) {
      return null;
    }
    return (
      <Base
        variantsProps={{
          dispatch,
          syntheticDocument,
          selectedNodes,
          selectedVariant,
          graph
        }}
        instanceVariantProps={{
          dispatch,
          syntheticDocument,
          selectedNodes,
          graph,
          selectedVariant
        }}
        prettyProps={{
          dispatch,
          syntheticDocument,
          selectedNodes,
          graph,
          fontFamilies
        }}
        {...rest}
      />
    );
  }
);
