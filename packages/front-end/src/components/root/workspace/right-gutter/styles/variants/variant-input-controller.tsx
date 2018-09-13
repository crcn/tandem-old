import * as React from "react";
import {
  SyntheticDocument,
  getOverrides,
  SyntheticNode,
  PCOverride,
  DependencyGraph,
  getSyntheticSourceNode,
  isPCComponentInstance,
  getPCNode,
  getPCVariants,
  PCComponent,
  getInspectorSourceNode,
  PCComponentInstanceElement,
  isSyntheticInstanceElement,
  SyntheticElement,
  PCVariant,
  SyntheticInstanceElement,
  InspectorNode,
  getInstanceVariantInfo,
  getInheritedAndSelfOverrides,
  PCOverridablePropertyName
} from "paperclip";
import { memoize, KeyValue } from "tandem-common";
import { Dispatch } from "redux";
import { VariantOption } from "./option.pc";
import { noop, last } from "lodash";
import {
  instanceVariantToggled,
  instanceVariantResetClicked
} from "../../../../../../actions";
import { BaseComponentInstanceVariantProps } from "./variant-input.pc";

export type Props = {
  selectedInspectorNode: InspectorNode;
  rootInspectorNode: InspectorNode;
  dispatch: Dispatch<any>;
  graph: DependencyGraph;
  selectedVariant: PCVariant;
};

export default (
  Base: React.ComponentClass<BaseComponentInstanceVariantProps>
) =>
  class VariantInputController extends React.PureComponent<Props> {
    onVariantToggle = (variant: PCVariant) => {
      this.props.dispatch(instanceVariantToggled(variant));
    };
    render() {
      const { onVariantToggle } = this;
      const {
        selectedInspectorNode,
        rootInspectorNode,
        graph,
        dispatch,
        selectedVariant
      } = this.props;
      const variantInfo = getInstanceVariantInfo(
        selectedInspectorNode,
        rootInspectorNode,
        graph
      );

      if (!variantInfo.length) {
        return null;
      }

      const options = variantInfo.map(({ variant, enabled }) => {
        return (
          <VariantOption
            enabled={enabled}
            key={variant.id}
            variant={variant}
            selected={selectedVariant && variant.id === selectedVariant.id}
            dispatch={dispatch}
            onToggle={onVariantToggle}
          />
        );
      });

      return <Base options={options} />;
    }
  };
