import * as React from "react";
import { Dispatch } from "redux";
import { compose, pure, withHandlers } from "recompose";
import {
  SyntheticNode,
  getSyntheticNodeSourceComponent,
  getComponentInstanceSyntheticNode,
  getSyntheticNodeOriginComponent,
  getSyntheticSourceNode,
  getComponentInstanceSourceNode,
  getSourceNodeById,
  isComponentInstanceSourceNode,
  PCVisibleNode,
  PCSourceNamespaces,
  getComponentVariants
} from "paperclip";
import { RootState } from "../../../../../state";
import { elementVariantToggled } from "../../../../../actions";
const { VariantOption: BaseVariantOption } = require("./index.pc");

type VariantOptionProps = {
  name: string;
  checked: boolean;
  onChange: (name: string) => any;
};

const VariantOption = compose<VariantOptionProps, VariantOptionProps>(pure)(
  ({ name, checked, onChange }) => {
    return (
      <BaseVariantOption
        checkboxContainerChildren={
          <input
            type="checkbox"
            checked={checked}
            onClick={() => onChange(name)}
          />
        }
        nameContainerChildren={name}
      />
    );
  }
);

type VariantInputOuterProps = {
  node: SyntheticNode;
  root: RootState;
  dispatch: Dispatch<any>;
};

type VariantInputInnerProps = {
  onVariantToggle: (name: string) => any;
} & VariantInputOuterProps;

const getVariant = (node: SyntheticNode, root: RootState) => {
  const sourceNode = getSyntheticSourceNode(
    node.id,
    root.browser
  ) as PCVisibleNode;
  return sourceNode.attributes.core.variants || [];
};

export const BaseVariantInput = ({
  node,
  root,
  onVariantToggle
}: VariantInputInnerProps) => {
  const sourceNode = getSyntheticSourceNode(node.id, root.browser);
  if (1 + 1) {
    return null;
  }
  if (!isComponentInstanceSourceNode(sourceNode)) {
    return null;
  }
  const originComponent = getSyntheticNodeOriginComponent(
    node.id,
    root.browser
  );
  const component = getSyntheticNodeSourceComponent(node.id, root.browser);
  if (originComponent.id === component.id) {
    return null;
  }
  const variants = getVariant(node, root);
  return (
    <div>
      Variant:{" "}
      {getComponentVariants(originComponent).map(
        ({
          attributes: {
            [PCSourceNamespaces.CORE]: { name }
          }
        }) => {
          return (
            <VariantOption
              key={name}
              name={name}
              checked={variants.indexOf(name) !== -1}
              onChange={onVariantToggle}
            />
          );
        }
      )}
    </div>
  );
};

export const VariantInput = compose<
  VariantInputInnerProps,
  VariantInputOuterProps
>(
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
