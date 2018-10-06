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
  PCOverridablePropertyName,
  PCSourceTagNames,
  extendsComponent,
  PCNode
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
  sourceNode: PCNode;
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
        sourceNode,
        selectedVariant,
        dispatch
      } = this.props;

      if (
        sourceNode.name !== PCSourceTagNames.COMPONENT_INSTANCE &&
        (sourceNode.name !== PCSourceTagNames.COMPONENT ||
          !extendsComponent(sourceNode))
      ) {
        return null;
      }

      const variantInfo = getInstanceVariantInfo(
        selectedInspectorNode,
        rootInspectorNode,
        graph,
        selectedVariant && selectedVariant.id
      );

      if (!variantInfo.length) {
        return null;
      }

      const options = variantInfo.map(({ variant, enabled }, i) => {
        return (
          <VariantOption
            alt={Boolean(i % 2)}
            enabled={enabled}
            key={variant.id}
            item={variant}
            dispatch={dispatch}
            onToggle={onVariantToggle}
          />
        );
      });

      return <Base options={options} />;
    }
  };
