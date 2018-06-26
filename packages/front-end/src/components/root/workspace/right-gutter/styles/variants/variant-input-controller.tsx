import * as React from "react";
import { compose, pure, withHandlers, withState } from "recompose";
import { SyntheticDocument, SyntheticNode, DependencyGraph, getSyntheticSourceNode, isComponent, isPCComponentInstance, getPCNode, getPCVariants, PCComponent, SyntheticInstanceElement, isSyntheticInstanceElement, PCVariant } from "paperclip";
import { Dispatch } from "redux";
const { VariantOption } = require("./option.pc");
const { VariantPill } = require("./pill.pc");
import { noop } from "lodash";
import { instanceVariantToggled, instanceVariantResetClicked } from "actions";

export type VariantInputControllerOuterProps = {
  syntheticDocument: SyntheticDocument;
  selectedNodes: SyntheticNode[];
  dispatch: Dispatch<any>;
  graph: DependencyGraph;
};

type VariantInputControllerInnerProps = {
  onVariantToggle: any;
  onVariantInputClick: any;
  editing: boolean;
  setEditing: any;
  onResetClick: any;
  onFocus: any;
  onBlur: any;
  onVariantReset: any;
} & VariantInputControllerOuterProps;

export default compose(
  pure,
  withState(`editing`, `setEditing`, false),
  withHandlers({
    onVariantToggle: ({ dispatch }) => (variant) => {
      dispatch(instanceVariantToggled(variant));
    },
    onResetClick: ({ dispatch }) => () => {
      dispatch(instanceVariantResetClicked());
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
    onVariantReset: ({ }) => (variant: PCVariant) => {

    }
  }),
  Base => ({ graph, selectedNodes, editing, onVariantToggle, onFocus, onResetClick, onBlur , onVariantReset }: VariantInputControllerInnerProps) => {
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

    if (!componentVariants.length) {
      return null;
    }

    const pillChildren = node.variant.filter(variantId => componentVariants.some(variant => variant.id === variantId)).map(variantId => {
      const variant = componentVariants.find(variant => variant.id === variantId);

      // may not exist if component variant is deleted
      if (!variant) {
        return null;
      }
      return <VariantPill key={variantId}>{variant.label}</VariantPill>;
    });

    const optionsChildren = componentVariants.map((variant) => {
      return <VariantOption variant={{ ...variant, isDefault: node.variant.indexOf(variant.id) !== -1 }} editable={false} onClick={noop} onToggle={onVariantToggle} onReset={onVariantReset} />;
    });

    return <Base
      tabIndex={-1}
      onBlur={onBlur}
      onFocus={onFocus}
      pillsProps={{
        children: pillChildren.length ? pillChildren : <VariantPill variant="empty">--</VariantPill>
      }}
      resetButtonProps={{
        style: {
          display: instance.variant ? "block" : "none"
        },
        onClick: onResetClick
      }}
      optionsProps={{
        style: {
          display: editing && optionsChildren.length ? "block" : "none"
        },
        children: editing ? optionsChildren : []
      }}
    />;
  }
)