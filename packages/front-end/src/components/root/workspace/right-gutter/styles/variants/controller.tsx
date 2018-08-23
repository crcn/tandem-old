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
import { BaseVariantsProps } from "./view.pc";

export type Props = {
  dispatch: Dispatch<any>;
  syntheticDocument: SyntheticDocument;
  selectedNodes: SyntheticVisibleNode[];
  selectedVariant: PCVariant;
  graph: DependencyGraph;
};

export type InnerProps = {
  onAddVariantButtonClick: any;
  onRemoveVariantButtonClick: any;
} & Props;

export default compose<InnerProps, Props>(
  pure,
  withHandlers({
    onAddVariantButtonClick: ({ dispatch }: InnerProps) => () => {
      dispatch(addVariantButtonClicked());
    },
    onRemoveVariantButtonClick: ({ dispatch }: InnerProps) => () => {
      dispatch(removeVariantButtonClicked());
    }
  }),
  (Base: React.ComponentClass<BaseVariantsProps>) => ({
    dispatch,
    onAddVariantButtonClick,
    onRemoveVariantButtonClick,
    selectedNodes,
    selectedVariant,
    syntheticDocument,
    graph
  }: InnerProps) => {
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
