import * as React from "react";
import { Dispatch } from "redux";
import { compose, pure, withHandlers } from "recompose";
import { SyntheticNode, getSyntheticNodeSourceComponent, getComponentInstanceSyntheticNode, getSyntheticNodeOriginComponent, getSyntheticSourceNode, PCSourceAttributeNames, getComponentInstanceSourceNode, getSourceNodeById, isComponentInstanceSourceNode } from "paperclip";
import { RootState } from "../../../../../state";
import { elementVariantToggled } from "../../../../../actions";
import { getAttribute } from "tandem-common";
const { VariantOption: BaseVariantOption } = require("./index.pc");

type VariantOptionProps = {
  name: string;
  checked: boolean;
  onChange: (name: string) => any;
};

const VariantOption = compose<VariantOptionProps, VariantOptionProps>(
  pure
)(({ name, checked, onChange}) => {
  return <BaseVariantOption checkboxContainerChildren={<input type="checkbox" checked={checked} onClick={() => onChange(name)} />} nameContainerChildren={name} />
});

type VariantInputOuterProps = {
  node: SyntheticNode;
  root: RootState;
  dispatch: Dispatch<any>;
};

type VariantInputInnerProps = {
  onVariantToggle: (name: string) => any;
} & VariantInputOuterProps;

const getVariant = (node: SyntheticNode, root: RootState) => {
  const sourceNode = getSyntheticSourceNode(node.id, root.browser);
  return getAttribute(sourceNode, PCSourceAttributeNames.VARIANTS) || [];
};

export const BaseVariantInput = ({ node, root, onVariantToggle }: VariantInputInnerProps) => {
  const sourceNode = getSyntheticSourceNode(node.id, root.browser);
  if (!isComponentInstanceSourceNode(sourceNode)) {
    return null;
  }
  const originComponent = getSyntheticNodeOriginComponent(node.id, root.browser);
  const component = getSyntheticNodeSourceComponent(node.id, root.browser);
  if (originComponent.id === component.id) {
    return null;
  }
  const variants = getVariant(node, root);
  return <div>
      Variant: {
        originComponent.states.map(({ name, isDefault }) => {
          return <VariantOption key={name} name={name} checked={variants.indexOf(name) !== -1} onChange={onVariantToggle} />
        })
      }
  </div>
};

export const VariantInput = compose<VariantInputInnerProps, VariantInputOuterProps>(
  pure,
  withHandlers({
    onVariantToggle: ({ dispatch, node, root }) => (name: string) => {
      const variants = [...getVariant(node, root)];
      let i = variants.indexOf(name);
      if (i !== -1) {
        variants.splice(i, 1);
      } else {
        variants.push(name);
      }

      dispatch(elementVariantToggled(variants, node));
    }
  })
)(BaseVariantInput);