import { SlimBaseNode, SlimParentNode, SlimVMObjectType, SlimCSSGroupingRule, SlimCSSMediaRule, SlimCSSRule, SlimCSSStyleDeclaration, SlimCSSStyleRule, SlimCSSStyleSheet, SlimElement, SlimElementAttribute, SlimFragment, SlimStyleElement, SlimTextNode, VMObjectSource } from "./state";
import { SetValueMutation, createSetValueMutation, diffArray, ARRAY_DELETE, ARRAY_DIFF, ARRAY_INSERT, ARRAY_UPDATE, createPropertyMutation, ArrayInsertMutation, ArrayDeleteMutation, ArrayMutation, ArrayUpdateMutation, Mutation, eachArrayValueMutation, createInsertChildMutation, createRemoveChildMutation, INSERT_CHILD_MUTATION } from "source-mutation";
import { compressRootNode } from "./compression";

// text
export const SET_TEXT_NODE_VALUE = "SET_TEXT_NODE_VALUE";

// parent node

export const INSERT_CHILD_NODE = "INSERT_CHILD_NODE";
export const REMOVE_CHILD_NODE = "REMOVE_CHILD_NODE";

// elements
export const SET_ATTRIBUTE_VALUE = "SET_ATTRIBUTE_VALUE";
export const ATTACH_SHADOW = "ATTACH_SHADOW";
export const REMOVE_SHADOW = "REMOVE_SHADOW";


export type SetTextNodeValueMutation = {} & SetValueMutation<VMObjectSource>;

export const diffNode = (oldNode: SlimBaseNode, newNode: SlimBaseNode) => {
  switch(oldNode.type) {
    case SlimVMObjectType.TEXT: return diffTextNode(oldNode as SlimTextNode, newNode as SlimTextNode);
    case SlimVMObjectType.ELEMENT: return diffElement(oldNode as SlimElement, newNode as SlimElement);
    case SlimVMObjectType.DOCUMENT: 
    case SlimVMObjectType.DOCUMENT_FRAGMENT: return diffDocumentFragment(oldNode as SlimParentNode, newNode as SlimParentNode);
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

const diffElement = (oldElement: SlimElement, newElement: SlimElement): Mutation<VMObjectSource>[] => {
  const diffs: Mutation<VMObjectSource>[] = [];

  eachArrayValueMutation(
    diffArray(oldElement.attributes, newElement.attributes, (a, b) => a.name === b.name ? 0 : -1),
    {
      insert({ index, value }) {
        diffs.push(
          createPropertyMutation(SET_ATTRIBUTE_VALUE, oldElement.source, value.name, value.value)
        );
      },
      delete({ index, value }) {
        diffs.push(createPropertyMutation(SET_ATTRIBUTE_VALUE, oldElement.source, value.name, null));
      },
      update({ index, newValue, originalOldIndex }) {
        if (newValue.value !== oldElement.attributes[originalOldIndex].value) {
          diffs.push(createPropertyMutation(SET_ATTRIBUTE_VALUE, oldElement.source, newValue.name, newValue.value));
        }
      }
    }
  );

  diffs.push(
    ...diffChildNodes(oldElement, newElement)
  );

  if (oldElement.shadow && newElement.shadow) {
    diffs.push(
      ...diffDocumentFragment(oldElement.shadow, newElement.shadow)
    );
  } else if (oldElement.shadow && !newElement.shadow) {
    diffs.push(
      createSetValueMutation(REMOVE_SHADOW, oldElement.source, null)
    );
  } else if (!oldElement.shadow && newElement.shadow) {
    diffs.push(
      createSetValueMutation(ATTACH_SHADOW, oldElement.source, compressRootNode(newElement.shadow))
    );
  }

  return diffs;
};


const diffDocumentFragment = (oldParent: SlimParentNode, newParent: SlimParentNode): Mutation<VMObjectSource>[] => {
  return diffChildNodes(oldParent, newParent);
};

const diffChildNodes = (oldParent: SlimParentNode, newParent: SlimParentNode): Mutation<VMObjectSource>[] => {
  const diffs: Mutation<VMObjectSource>[] = [];

  eachArrayValueMutation(
    diffArray(oldParent.childNodes, newParent.childNodes, compareNodeDiffs),
    {
      insert({ index, value }) {
        diffs.push(
          createInsertChildMutation(
            INSERT_CHILD_NODE,
            oldParent.source,
            compressRootNode(value)
          )
        )
      },
      delete({ index, value }) {
        diffs.push(
          createRemoveChildMutation(
            REMOVE_CHILD_NODE,
            oldParent.source,
            null,
            index
          )
        );
      },
      update({ index, newValue, originalOldIndex }) {
        diffs.push(
          ...diffNode(
            oldParent.childNodes[originalOldIndex],
            newValue
          )
        );
      }
    }
  )  

  return diffs;
}

const compareNodeDiffs = (a: SlimBaseNode, b: SlimBaseNode) => {
  if (a.type !== b.type) {
    return -1;
  }

  if (a.type === SlimVMObjectType.ELEMENT) {

    // if the tag names are not the same, then return no match
    if ((a as SlimElement).tagName !== (b as SlimElement).tagName) {
      return -1;
    }

    // return identical match for now
    return 0;
  }

  if (a.type === SlimVMObjectType.TEXT) {
    return (a as SlimTextNode).value === (b as SlimTextNode).value ? 0 : 1;
  }

  return 0;
}