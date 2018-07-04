import * as React from "react";
import { compose, pure, withHandlers, withState } from "recompose";
import {
  SyntheticDocument,
  SyntheticNode,
  DependencyGraph,
  getSyntheticSourceNode,
  isComponent,
  isPCComponentInstance,
  getPCNode,
  getPCVariants,
  PCComponent,
  SyntheticInstanceElement,
  isSyntheticInstanceElement,
  PCVariant,
  getPCVariantOverrides,
  getInheritedOverrides,
  PCOverridablePropertyName
} from "paperclip";
import { Dispatch } from "redux";
const { VariantOption } = require("./option.pc");
const { VariantPill } = require("./pill.pc");
import { noop, last } from "lodash";
import { instanceVariantToggled, instanceVariantResetClicked } from "actions";

export type VariantInputControllerOuterProps = {
  syntheticDocument: SyntheticDocument;
  selectedNodes: SyntheticNode[];
  dispatch: Dispatch<any>;
  graph: DependencyGraph;
  selectedVariant: PCVariant;
};

type VariantInputControllerInnerProps = {
  onVariantToggle: any;
  onVariantInputClick: any;
  editing: boolean;
  setEditing: any;
  onFocus: any;
  onBlur: any;
  onVariantReset: any;
} & VariantInputControllerOuterProps;

export default compose(
  pure,
  withState(`editing`, `setEditing`, false),
  withHandlers({
    onVariantToggle: ({ dispatch }) => variant => {
      dispatch(instanceVariantToggled(variant));
    },
    onVariantInputClick: ({ setEditing, editing }) => () => {
      setEditing(!editing);
    },
    onFocus: ({ setEditing }) => () => {
      setEditing(true);
    },
    onBlur: ({ setEditing }) => () => {
      setEditing(false);
    },
    onVariantReset: ({ dispatch }) => (variant: PCVariant) => {
      dispatch(instanceVariantResetClicked(variant));
    }
  }),
  Base => ({
    graph,
    selectedNodes,
    editing,
    onVariantToggle,
    onFocus,
    onBlur,
    selectedVariant,
    onVariantReset,
    syntheticDocument
  }: VariantInputControllerInnerProps) => {
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
    const overrides = getInheritedOverrides(
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
);
