import * as React from "react";
import { compose, pure } from "recompose";

export default compose(
  pure,
  Base => ({
    dispatch,
    syntheticDocument,
    selectedNodes,
    selectedVariant,
    fontFamilies,
    selectedInheritComponentId,
    graph, ...rest }) => {
    return <Base
      variantsProps={{dispatch, syntheticDocument, selectedNodes, selectedVariant, graph}}
      instanceVariantProps={{dispatch, syntheticDocument, selectedNodes, graph, selectedVariant}}
      prettyProps={{dispatch, syntheticDocument, selectedNodes, graph, fontFamilies, selectedInheritComponentId}} {...rest} />
  }
);