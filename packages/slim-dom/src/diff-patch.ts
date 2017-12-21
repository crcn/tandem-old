import { SlimBaseNode, SlimParentNode, SlimVMObjectType, SlimCSSGroupingRule, SlimCSSMediaRule, SlimCSSRule, SlimCSSStyleDeclaration, SlimCSSStyleRule, SlimCSSStyleSheet, SlimElement, SlimElementAttribute, SlimFragment, SlimStyleElement, SlimTextNode, VMObjectSource } from "./state";
import { SetValueMutation, createSetValueMutation, diffArray, ARRAY_DELETE, ARRAY_DIFF, ARRAY_INSERT, ARRAY_UPDATE, createPropertyMutation, ArrayInsertMutation, ArrayDeleteMutation, ArrayMutation, ArrayUpdateMutation } from "source-mutation";

// text
export const SET_TEXT_NODE_VALUE = "SET_TEXT_NODE_VALUE";

// elements
export const SET_ATTRIBUTE_VALUE = "SET_ATTRIBUTE_VALUE";

export type SetTextNodeValueMutation = {} & SetValueMutation<VMObjectSource>;

export const diffNode = (oldNode: SlimBaseNode, newNode: SlimBaseNode) => {
  switch(oldNode.type) {
    case SlimVMObjectType.TEXT: return diffTextNode(oldNode as SlimTextNode, newNode as SlimTextNode);
    case SlimVMObjectType.ELEMENT: return diffElement(oldNode as SlimElement, newNode as SlimElement);
    default: {
      throw new Error(`Unable to diff`);
    }
  }
}

const diffTextNode = (oldNode: SlimTextNode, newNode: SlimTextNode) => {
  if(oldNode.value !== newNode.value) {
    return [createSetValueMutation(SET_TEXT_NODE_VALUE, oldNode.source, newNode.value)];
  }
};

const diffElement = (oldElement: SlimElement, newElement: SlimElement) => {
  const diffs = [];

  diffs.push(
    ...diffArray(oldElement.attributes, newElement.attributes, (a, b) => a.name === b.name ? 0 : -1).mutations.map((mutation) => {
      switch(mutation.type) {
        case ARRAY_INSERT: {
          return createPropertyMutation(SET_ATTRIBUTE_VALUE, oldElement.source, mutation.target.name, (mutation as ArrayInsertMutation<SlimElementAttribute>).value.value);
        }
        case ARRAY_DELETE: {
          return createPropertyMutation(SET_ATTRIBUTE_VALUE, oldElement.source, oldElement.attributes[(mutation as ArrayDeleteMutation<any>).index].name, undefined);
        }
        case ARRAY_UPDATE: {
          if ((mutation as ArrayUpdateMutation<SlimElementAttribute>).newValue.value !== oldElement.attributes[(mutation as ArrayUpdateMutation<SlimElementAttribute>).originalOldIndex].value) {
            return createPropertyMutation(SET_ATTRIBUTE_VALUE, oldElement.source, oldElement.attributes[(mutation as ArrayUpdateMutation<SlimElementAttribute>).originalOldIndex].name, (mutation as ArrayUpdateMutation<SlimElementAttribute>).newValue.value);
          }
        }
      }
    }).filter(Boolean)
  );


  return diffs;
};
