import * as React from "react";
import { compose, pure, withHandlers } from "recompose";
import {
  SyntheticDocument,
  SyntheticVisibleNode,
  getPCVariants,
  getSyntheticContentNode,
  getPCNode,
  DependencyGraph,
  getSyntheticSourceNode,
  isComponent,
  PCVariant
} from "paperclip";
import { Dispatch } from "redux";
const { VariantOption } = require("./option.pc");
import {
  addVariantButtonClicked,
  removeVariantButtonClicked
} from "../../../../../../actions";

export type VariantsControllerOuterProps = {
  dispatch: Dispatch<any>;
  syntheticDocument: SyntheticDocument;
  selectedNodes: SyntheticVisibleNode[];
  selectedVariant: PCVariant;
  graph: DependencyGraph;
};

export type VariantsControllerInnerProps = {
  onAddVariantButtonClick: any;
  onRemoveVariantButtonClick: any;
} & VariantsControllerOuterProps;

export default compose(
  pure,
  withHandlers({
    onAddVariantButtonClick: ({
      dispatch
    }: VariantsControllerOuterProps) => () => {
      dispatch(addVariantButtonClicked());
    },
    onRemoveVariantButtonClick: ({
      dispatch
    }: VariantsControllerOuterProps) => () => {
      dispatch(removeVariantButtonClicked());
    }
  }),
  Base => ({
    dispatch,
    onAddVariantButtonClick,
    onRemoveVariantButtonClick,
    selectedNodes,
    selectedVariant,
    syntheticDocument,
    graph
  }: VariantsControllerInnerProps) => {
    const contentNode = getSyntheticContentNode(
      selectedNodes[0],
      syntheticDocument
    );
    const contentSourceNode = getSyntheticSourceNode(contentNode, graph);
    if (!contentSourceNode || !isComponent(contentSourceNode)) {
      return null;
    }

    const variants = getPCVariants(contentSourceNode);

    const variantOptions = variants.map(variant => {
      return (
        <VariantOption
          key={variant.id}
          selected={selectedVariant ? variant.id === selectedVariant.id : false}
          dispatch={dispatch}
          variant={variant}
        />
      );
    });

    return (
      <Base
        removeVariantButtonProps={{
          onClick: onRemoveVariantButtonClick,
          style: {
            display: selectedVariant ? "block" : "none"
          }
        }}
        addVariantButtonProps={{
          onClick: onAddVariantButtonClick
        }}
        listProps={{
          children: variantOptions
        }}
      />
    );
  }
);
