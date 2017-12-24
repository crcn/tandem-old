import { SlimBaseNode, SlimParentNode, SlimVMObjectType, SlimCSSGroupingRule, SlimCSSMediaRule, SlimCSSRule, SlimCSSStyleDeclaration, SlimCSSStyleRule, SlimCSSStyleSheet, SlimElement, SlimElementAttribute, SlimFragment, SlimStyleElement, SlimTextNode, VMObjectSource } from "./state";
import { SetValueMutation, createSetValueMutation, diffArray, ARRAY_DELETE, ARRAY_DIFF, ARRAY_INSERT, ARRAY_UPDATE, createPropertyMutation, ArrayInsertMutation, ArrayDeleteMutation, ArrayMutation, ArrayUpdateMutation, Mutation, eachArrayValueMutation, createInsertChildMutation, createRemoveChildMutation, INSERT_CHILD_MUTATION, SetPropertyMutation, RemoveChildMutation, InsertChildMutation } from "source-mutation";
import { compressRootNode, uncompressRootNode } from "./compression";
import { weakMemo, flattenObjects, getNodePath, replaceNestedChild, setTextNodeValue, removeChildNodeAt, insertChildNode, setElementAttribute } from "./utils";

import { getVMObjectTree } from "./tree";

// text
export const SET_TEXT_NODE_VALUE = "SET_TEXT_NODE_VALUE";

// parent node

export const INSERT_CHILD_NODE = "INSERT_CHILD_NODE";
export const REMOVE_CHILD_NODE = "REMOVE_CHILD_NODE";

// elements
export const SET_ATTRIBUTE_VALUE = "SET_ATTRIBUTE_VALUE";
export const ATTACH_SHADOW = "ATTACH_SHADOW";
export const REMOVE_SHADOW = "REMOVE_SHADOW";

// CSS Grouping
export const CSS_INSERT_RULE = "CSS_INSERT_RULE";
export const CSS_DELETE_RULE = "CSS_DELETE_RULE";

// CSS Style Rule
export const CSS_SET_STYLE_PROPERTY = "CSS_SET_STYLE_PROPERTY";
export const CSS_SET_SELECTOR_TEXT = "CSS_SET_SELECTOR_TEXT";


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
    diffArray(oldElement.attributes, newElement.attributes, (a, b) => {
      if (a.name === b.name) {
        return 0;
      }

      return -1;
    }),
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
        const oldAttrValue = oldElement.attributes[originalOldIndex].value;
        if (newValue.value !== oldAttrValue && (typeof newValue.value !== "object" || JSON.stringify(newValue.value) !== JSON.stringify(oldAttrValue))) {
          diffs.push(createPropertyMutation(SET_ATTRIBUTE_VALUE, oldElement.id, newValue.name, newValue.value));
        }
      }
    }
  );

  if (oldElement.tagName === "style") {
    diffs.push(
      ...diffCSSRule((oldElement as SlimStyleElement).sheet, (newElement as SlimStyleElement).sheet)
    );
  }

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
};

const diffCSSRule = (oldRule: SlimCSSRule, newRule: SlimCSSRule) => {
  switch(oldRule.type) {
    case SlimVMObjectType.STYLE_SHEET: return diffCSSStyleSheet(oldRule as SlimCSSStyleSheet, newRule as SlimCSSStyleSheet);
    case SlimVMObjectType.STYLE_RULE: return diffCSSStyleRule(oldRule as SlimCSSStyleRule, newRule as SlimCSSStyleRule);
  }
  return [];
}

const diffCSSStyleSheet = (oldSheet: SlimCSSStyleSheet, newSheet: SlimCSSStyleSheet) => {
  return diffCSSGroupingRuleChildren(oldSheet, newSheet);
}


const diffCSSStyleRule = (oldRule: SlimCSSStyleRule, newRule: SlimCSSStyleRule) => {
  const diffs = [];
  if (oldRule.selectorText !== newRule.selectorText) {
    diffs.push(createSetValueMutation(CSS_SET_SELECTOR_TEXT, oldRule.id, newRule.selectorText));
  }
  eachArrayValueMutation(
    diffArray(Object.keys(oldRule.style), Object.keys(newRule.style), (a, b) => a === b ? 0 : -1),
    {
      insert({ index, value}) {
        diffs.push(
          createPropertyMutation(CSS_SET_STYLE_PROPERTY, oldRule.id, value, newRule.style[value])
        );
      },
      delete({ index, value }) {
        diffs.push(
          createPropertyMutation(CSS_SET_STYLE_PROPERTY, oldRule.id, value, undefined)
        );
      },
      update({ newValue }) {
        if (newValue === "id") return;
        if (newRule.style[newValue] !== oldRule.style[newValue]) {
          diffs.push(
            createPropertyMutation(CSS_SET_STYLE_PROPERTY, oldRule.id, newValue, newRule.style[newValue])
          );
        }
      }
    }
  )
  return diffs;
}

const diffCSSGroupingRuleChildren = (oldRule: SlimCSSGroupingRule, newRule: SlimCSSGroupingRule) => {
  const diffs: Mutation<string>[] = [];

  eachArrayValueMutation(
    diffArray(oldRule.rules, newRule.rules, compareCSSRules),
    {
      insert({ index, value }) {
        diffs.push(createInsertChildMutation(CSS_INSERT_RULE, oldRule.id, compressRootNode(value), index));
      },
      delete({ index }) {
        diffs.push(createRemoveChildMutation(CSS_DELETE_RULE, oldRule.id, null, index));
      },
      update({ newValue, originalOldIndex }) {
        diffs.push(
          ...diffCSSRule(
            oldRule.rules[originalOldIndex],
            newValue
          )
        );
      }
    }
  )

  return diffs;
}
const compareCSSRules = (a: SlimCSSRule, b: SlimCSSRule) => {
  if (a.type !== b.type) {
    return -1;
  }

  if (a.type === SlimVMObjectType.STYLE_RULE) {
    return (a as SlimCSSStyleRule).selectorText === (a as SlimCSSStyleRule).selectorText ? 0 : 1;
  }

  // TODO - check media

  return 1;
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
    const allObjects = flattenObjects(root);
    const diff = diffs[i];
    const info = allObjects[diff.target];
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
      case CSS_SET_SELECTOR_TEXT: {
        const { newValue } = diff as SetValueMutation<string>;
        newTarget = { ...newTarget, selectorText: newValue } as SlimCSSStyleRule;
        break;
      }
      case CSS_SET_STYLE_PROPERTY: {
        const { name, newValue } = diff as SetPropertyMutation<string>;
        const styleRule = newTarget as SlimCSSStyleRule;
        newTarget = { ...styleRule, style: {
          ...styleRule.style,
          [name]: newValue
        } } as SlimCSSStyleRule;
        break;
      }
      case CSS_INSERT_RULE: {
        const { child } = diff as InsertChildMutation<any, any>;
        const styleRule = newTarget as SlimCSSGroupingRule;
        newTarget = { ...styleRule, rules: [...styleRule.rules, uncompressRootNode(child)] } as SlimCSSGroupingRule;
        break;
      }
      case CSS_DELETE_RULE: {
        const { index } = diff as InsertChildMutation<any, any>;
        const styleRule = newTarget as SlimCSSGroupingRule;
        newTarget = { ...styleRule, rules: [
          ...styleRule.rules.slice(0, index),
          styleRule.rules.slice(0, index + 1)
        ] } as SlimCSSGroupingRule;
        break;
      }
    }

    if (newTarget !== target) {
      root = replaceNestedChild(root, getNodePath(target, root), newTarget);
    }
  }

  return root;
};