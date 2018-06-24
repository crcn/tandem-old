import * as React from "react";
import { compose, pure, withHandlers } from "recompose";
import { SyntheticDocument, SyntheticVisibleNode, getPCVariants, getSyntheticContentNode, getPCNode, DependencyGraph, getSyntheticSourceNode, isComponent } from "paperclip";
import { Dispatch } from "redux";
const { VariantOption } = require("./option.pc");
import { addVariantButtonClicked } from "../../../../../../actions";

export type VariantsControllerOuterProps = {
  dispatch: Dispatch<any>;
  syntheticDocument: SyntheticDocument;
  selectedNodes: SyntheticVisibleNode[];
  graph: DependencyGraph;
};

export type VariantsControllerInnerProps = {
  onAddVariantButtonClick: any;
} & VariantsControllerOuterProps;

export default compose(
  pure,
  withHandlers({
    onAddVariantButtonClick: ({ dispatch }: VariantsControllerOuterProps) => () => {
      dispatch(addVariantButtonClicked());
    }
  }),
  Base => ({ onAddVariantButtonClick, selectedNodes, syntheticDocument, graph }: VariantsControllerInnerProps) => {
    const contentNode = getSyntheticContentNode(selectedNodes[0], syntheticDocument);
    const contentSourceNode = getSyntheticSourceNode(contentNode, graph);
    if (!contentSourceNode || !isComponent(contentSourceNode)) {
      return null;
    }

    const variants = getPCVariants(contentSourceNode)

    const variantOptions = variants.map(variant => {
      return <VariantOption key={variant.id} variant={variant} />
    });

    return <Base
    addVariantButtonProps={{
      onClick: onAddVariantButtonClick
    }}
    listProps={{
      children: variantOptions
    }} />;
  }
)