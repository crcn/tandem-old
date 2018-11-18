import * as React from "react";
import {
  SyntheticDocument,
  SyntheticVisibleNode,
  getPCVariants,
  getSyntheticContentNode,
  getPCNode,
  DependencyGraph,
  getSyntheticSourceNode,
  isComponent,
  PCVariant,
  InspectorNode,
  getInspectorContentNode
} from "paperclip";
import { Dispatch } from "redux";
import { VariantOption } from "./option.pc";
import {
  addVariantButtonClicked,
  removeVariantButtonClicked
} from "../../../../../../actions";

export type Props = {
  dispatch: Dispatch<any>;
  rootInspectorNode: InspectorNode;
  selectedInspectorNodes: InspectorNode[];
  selectedVariant: PCVariant;
  graph: DependencyGraph;
};

export type InnerProps = {
  onAddVariantButtonClick: any;
  onRemoveVariantButtonClick: any;
} & Props;

export default (Base: React.ComponentClass<any>) =>
  class VariantsController extends React.PureComponent<Props> {
    onAddVariantButtonClick = () => {};
    onRemoveVariantButtonClick = () => {};
    render() {
      const { onRemoveVariantButtonClick, onAddVariantButtonClick } = this;
      const {
        dispatch,
        selectedInspectorNodes,
        rootInspectorNode,
        graph,
        selectedVariant
      } = this.props;

      const contentNode = getInspectorContentNode(
        selectedInspectorNodes[0],
        rootInspectorNode
      );
      const contentSourceNode = getPCNode(contentNode.sourceNodeId, graph);
      if (!contentSourceNode || !isComponent(contentSourceNode)) {
        return null;
      }

      const variants = getPCVariants(contentSourceNode);

      const variantOptions = variants.map(variant => {
        return (
          <VariantOption key={variant.id} dispatch={dispatch} item={variant} />
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
  };
