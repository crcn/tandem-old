import * as React from "react";
import { BaseStylesProps } from "./view.pc";
import { Dispatch } from "redux";
import {
  SyntheticDocument,
  SyntheticElement,
  PCVariant,
  DependencyGraph
} from "paperclip";
import { FontFamily } from "../../../../../state";

export type Props = {
  visible: boolean;
  dispatch: Dispatch<any>;
  syntheticDocument: SyntheticDocument;
  selectedNodes: SyntheticElement[];
  selectedVariant: PCVariant;
  fontFamilies: FontFamily[];
  graph: DependencyGraph;
} & BaseStylesProps;

export default (Base: React.ComponentClass<BaseStylesProps>) =>
  class RightGutterController extends React.PureComponent<Props> {
    render() {
      const {
        visible,
        dispatch,
        syntheticDocument,
        selectedNodes,
        selectedVariant,
        fontFamilies,
        graph,
        ...rest
      } = this.props;
      if (!selectedNodes.length || !visible) {
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
          styleSwitcherProps={{
            dispatch,
            syntheticDocument,
            selectedNodes,
            graph,
            selectedVariant
          }}
          {...rest}
        />
      );
    }
  };
