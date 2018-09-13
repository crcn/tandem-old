import * as React from "react";
import { Dispatch } from "redux";
import { BaseStyleSwitcherProps } from "./view.pc";
import { DropdownMenuOption } from "../../../../../inputs/dropdown/controller";
import {
  styleVariantDropdownChanged,
  newStyleVariantButtonClicked,
  addStyleButtonClicked,
  removeStyleButtonClicked
} from "../../../../../../actions";
import {
  PCComponent,
  SyntheticDocument,
  SyntheticVisibleNode,
  PCVariant,
  DependencyGraph,
  getPCVariants,
  getSyntheticSourceNode,
  getSyntheticContentNode,
  isComponent
} from "paperclip";

export type Props = {
  dispatch: Dispatch<any>;
  syntheticDocument: SyntheticDocument;
  selectedNodes: SyntheticVisibleNode[];
  selectedVariant: PCVariant;
  graph: DependencyGraph;
};

export default (Base: React.ComponentClass<BaseStyleSwitcherProps>) =>
  class StyleSwitcherController extends React.PureComponent<Props> {
    onAddVariantButtonClick = () => {
      this.props.dispatch(newStyleVariantButtonClicked());
    };
    onRemoveVariantButtonClick = () => {
      this.props.dispatch(removeStyleButtonClicked());
    };
    onStyleChange = value => {
      const contentNode = getSyntheticContentNode(
        this.props.selectedNodes[0],
        this.props.syntheticDocument
      );
      const component = getSyntheticSourceNode(
        contentNode,
        this.props.graph
      ) as PCComponent;

      this.props.dispatch(styleVariantDropdownChanged(value, component));
    };
    render() {
      const {
        onRemoveVariantButtonClick,
        onAddVariantButtonClick,
        onStyleChange
      } = this;
      const {
        selectedNodes,
        syntheticDocument,
        graph,
        selectedVariant
      } = this.props;

      if (!selectedNodes) {
        return null;
      }

      const contentNode = getSyntheticContentNode(
        selectedNodes[0],
        syntheticDocument
      );
      const contentSourceNode = getSyntheticSourceNode(contentNode, graph);
      if (!contentSourceNode || !isComponent(contentSourceNode)) {
        return null;
      }

      const variants = getPCVariants(contentSourceNode);
      const options: DropdownMenuOption[] = [
        { value: undefined, label: "--" },
        ...variants.map(variant => {
          return {
            value: variant,
            label: variant.label
          };
        })
      ];

      return (
        <Base
          addStyleButtonProps={{ onClick: onAddVariantButtonClick }}
          removeStyleButtonProps={{
            style: {
              display: selectedVariant ? "block" : "none"
            },
            onClick: onRemoveVariantButtonClick
          }}
          dropdownProps={{
            value: variants.find(
              variant => variant.id === (selectedVariant && selectedVariant.id)
            ),
            options,
            onChange: onStyleChange
          }}
        />
      );
    }
  };
