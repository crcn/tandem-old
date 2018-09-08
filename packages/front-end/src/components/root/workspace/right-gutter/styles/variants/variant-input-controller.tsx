import * as React from "react";
import {
  SyntheticDocument,
  SyntheticNode,
  DependencyGraph,
  getSyntheticSourceNode,
  isPCComponentInstance,
  getPCNode,
  getPCVariants,
  PCComponent,
  isSyntheticInstanceElement,
  PCVariant,
  getInheritedAndSelfOverrides,
  PCOverridablePropertyName
} from "paperclip";
import { Dispatch } from "redux";
import { VariantOption } from "./option.pc";
import { VariantPill } from "./pill.pc";
import { noop, last } from "lodash";
import {
  instanceVariantToggled,
  instanceVariantResetClicked
} from "../../../../../../actions";
import { BaseComponentInstanceVariantProps } from "./variant-input.pc";

export type Props = {
  syntheticDocument: SyntheticDocument;
  selectedNodes: SyntheticNode[];
  dispatch: Dispatch<any>;
  graph: DependencyGraph;
  selectedVariant: PCVariant;
};

type State = {
  editing: boolean;
};

export default (
  Base: React.ComponentClass<BaseComponentInstanceVariantProps>
) =>
  class VariantInputController extends React.PureComponent<Props, State> {
    state = {
      editing: false
    };
    setEditing(value: boolean) {
      this.setState({ ...this.state, editing: value });
    }
    onVariantToggle = (variant: PCVariant) => {
      this.props.dispatch(instanceVariantToggled(variant));
    };
    onVariantInputClick = () => {
      this.setEditing(!this.state.editing);
    };
    onFocus = () => {
      this.setEditing(true);
    };
    onBlur = () => {
      this.setEditing(false);
    };
    onVariantReset = (variant: PCVariant) => {
      this.props.dispatch(instanceVariantResetClicked(variant));
    };
    render() {
      const { onVariantToggle, onVariantReset, onBlur, onFocus } = this;
      const { editing } = this.state;
      const {
        selectedNodes,
        graph,
        syntheticDocument,
        selectedVariant
      } = this.props;

      const node = selectedNodes[0];
      if (!isSyntheticInstanceElement(node)) {
        return null;
      }

      const instance = getSyntheticSourceNode(node, graph);
      if (!isPCComponentInstance(instance)) {
        return null;
      }

      const component = getPCNode(instance.is, graph) as PCComponent;
      const componentVariants = getPCVariants(component);
      const overrides = getInheritedAndSelfOverrides(
        node,
        syntheticDocument,
        graph,
        selectedVariant && selectedVariant.id
      );

      const variantOverrides = overrides.filter(
        override =>
          override.propertyName === PCOverridablePropertyName.VARIANT_IS_DEFAULT
      );

      if (!componentVariants.length) {
        return null;
      }

      const pillChildren = Object.keys(node.variant)
        .filter(variantId => node.variant[variantId])
        .map(variantId => {
          const variant = componentVariants.find(
            variant => variant.id === variantId
          );

          // may not exist if component variant is deleted
          if (!variant) {
            return null;
          }
          return <VariantPill key={variantId}>{variant.label}</VariantPill>;
        });

      const optionsChildren = componentVariants.map(variant => {
        const override = variantOverrides.find(
          override => last(override.targetIdPath) === variant.id
        );
        return (
          <VariantOption
            variant={{ ...variant, isDefault: node.variant[variant.id] }}
            editable={false}
            onClick={noop}
            onToggle={onVariantToggle}
            onReset={override ? onVariantReset : null}
          />
        );
      });

      return (
        <Base
          tabIndex={-1}
          onBlur={onBlur}
          onFocus={onFocus}
          pillsProps={{
            children: pillChildren.length ? (
              pillChildren
            ) : (
              <VariantPill variant="empty">--</VariantPill>
            )
          }}
          optionsProps={{
            style: {
              display: editing && optionsChildren.length ? "block" : "none"
            },
            children: editing ? optionsChildren : []
          }}
        />
      );
    }
  };
