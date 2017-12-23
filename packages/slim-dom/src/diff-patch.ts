import { SlimBaseNode, SlimParentNode, SlimVMObjectType, SlimCSSGroupingRule, SlimCSSMediaRule, SlimCSSRule, SlimCSSStyleDeclaration, SlimCSSStyleRule, SlimCSSStyleSheet, SlimElement, SlimElementAttribute, SlimFragment, SlimStyleElement, SlimTextNode, VMObjectSource } from "./state";
import { SetValueMutation, createSetValueMutation, diffArray, ARRAY_DELETE, ARRAY_DIFF, ARRAY_INSERT, ARRAY_UPDATE, createPropertyMutation, ArrayInsertMutation, ArrayDeleteMutation, ArrayMutation, ArrayUpdateMutation, Mutation, eachArrayValueMutation, createInsertChildMutation, createRemoveChildMutation, INSERT_CHILD_MUTATION, SetPropertyMutation, RemoveChildMutation, InsertChildMutation } from "source-mutation";
import { compressRootNode, uncompressRootNode } from "./compression";
import { weakMemo, flattenObjects, getNodePath, replaceNestedChild, setTextNodeValue, removeChildNodeAt, insertChildNode, setElementAttribute } from "./utils";

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

export const diffNode = weakMemo((oldNode: SlimBaseNode, newNode: SlimBaseNode) => {
  switch(oldNode.type) {
    case SlimVMObjectType.TEXT: return diffTextNode(oldNode as SlimTextNode, newNode as SlimTextNode);
    case SlimVMObjectType.ELEMENT: return diffElement(oldNode as SlimElement, newNode as SlimElement);
    case SlimVMObjectType.DOCUMENT: 
    case SlimVMObjectType.DOCUMENT_FRAGMENT: return diffDocumentFragment(oldNode as SlimParentNode, newNode as SlimParentNode);
    default: {
      throw new Error(`Unable to diff`);
    }
  }
});

const diffTextNode = (oldNode: SlimTextNode, newNode: SlimTextNode) => {
  if(oldNode.value !== newNode.value) {
    return [createSetValueMutation(SET_TEXT_NODE_VALUE, oldNode.id, newNode.value)];
  }
};

const diffElement = (oldElement: SlimElement, newElement: SlimElement): Mutation<string>[] => {
  const diffs: Mutation<string>[] = [];

  eachArrayValueMutation(
    diffArray(oldElement.attributes, newElement.attributes, (a, b) => a.name === b.name ? 0 : -1),
    {
      insert({ index, value }) {
        diffs.push(
          createPropertyMutation(SET_ATTRIBUTE_VALUE, oldElement.id, value.name, value.value)
        );
      },
      delete({ index, value }) {
        diffs.push(createPropertyMutation(SET_ATTRIBUTE_VALUE, oldElement.id, value.name, null));
      },
      update({ index, newValue, originalOldIndex }) {
        if (newValue.value !== oldElement.attributes[originalOldIndex].value) {
          diffs.push(createPropertyMutation(SET_ATTRIBUTE_VALUE, oldElement.id, newValue.name, newValue.value));
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
      createSetValueMutation(REMOVE_SHADOW, oldElement.id, null)
    );
  } else if (!oldElement.shadow && newElement.shadow) {
    diffs.push(
      createSetValueMutation(ATTACH_SHADOW, oldElement.id, compressRootNode(newElement.shadow))
    );
  }

  return diffs;
};

const diffDocumentFragment = (oldParent: SlimParentNode, newParent: SlimParentNode): Mutation<string>[] => {
  return diffChildNodes(oldParent, newParent);
};

const diffChildNodes = (oldParent: SlimParentNode, newParent: SlimParentNode): Mutation<string>[] => {
  const diffs: Mutation<string>[] = [];

  eachArrayValueMutation(
    diffArray(oldParent.childNodes, newParent.childNodes, compareNodeDiffs),
    {
      insert({ index, value }) {
        diffs.push(
          createInsertChildMutation(
            INSERT_CHILD_NODE,
            oldParent.id,
            compressRootNode(value)
          )
        )
      },
      delete({ index, value }) {
        diffs.push(
          createRemoveChildMutation(
            REMOVE_CHILD_NODE,
            oldParent.id,
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

export const patchNode = <TNode extends SlimParentNode>(root: TNode, diffs: Mutation<string>[]) => {

  for (let i = 0, {length} = diffs; i < length; i++) {
    const diff = diffs[i];
    const info = flattenObjects(root)[diff.target];
    if (!info) {
      throw new Error(`diff ${JSON.stringify(diff)} doesn't have a matching node.`);
    }
    const target = info.value;
    let newTarget = target;

    switch(diff.type) {
      case SET_TEXT_NODE_VALUE: {
        const { newValue } = diff as SetValueMutation<string>;
        newTarget = setTextNodeValue(target as SlimTextNode, newValue);
        break;
      }
      case SET_ATTRIBUTE_VALUE: {
        const { name, newValue } = diff as SetPropertyMutation<string>;
        newTarget = setElementAttribute(target as SlimElement, name, newValue);
        break;
      }
      case REMOVE_CHILD_NODE: {
        const { index } = diff as RemoveChildMutation<any, any>;
        newTarget = removeChildNodeAt(newTarget as SlimParentNode, index);
        break;
      }
      case INSERT_CHILD_NODE: {
        const { index, child } = diff as InsertChildMutation<any, any>;
        newTarget = insertChildNode(newTarget as SlimParentNode, uncompressRootNode(child), index);
        break;
      }
    }

    if (newTarget !== target) {
      root = replaceNestedChild(root, getNodePath(target, root), newTarget);
    }
  }

  return root;
};