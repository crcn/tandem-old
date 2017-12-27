import { SlimBaseNode, SlimParentNode, SlimVMObjectType, SlimCSSGroupingRule, SlimCSSAtRule, SlimCSSRule, SlimCSSStyleDeclaration, SlimCSSStyleRule, SlimCSSStyleSheet, SlimElement, SlimElementAttribute, SlimFragment, SlimStyleElement, SlimTextNode, VMObjectSource } from "./state";
import { SetValueMutation, createSetValueMutation, diffArray, ARRAY_DELETE, ARRAY_DIFF, ARRAY_INSERT, ARRAY_UPDATE, createPropertyMutation, ArrayInsertMutation, ArrayDeleteMutation, ArrayMutation, ArrayUpdateMutation, Mutation, eachArrayValueMutation, createInsertChildMutation, createRemoveChildMutation, INSERT_CHILD_MUTATION, SetPropertyMutation, RemoveChildMutation, InsertChildMutation, createMoveChildMutation, MoveChildMutation } from "source-mutation";
import { compressRootNode, uncompressRootNode } from "./compression";
import { weakMemo, flattenObjects, getVMObjectPath, replaceNestedChild, setTextNodeValue, removeChildNodeAt, insertChildNode, setElementAttribute, moveChildNode, moveCSSRule, insertCSSRule, removeCSSRuleAt, setCSSSelectorText, setCSSStyleProperty, getVMObjectFromPath, setCSSAtRuleSetParams } from "./utils";
import { isEqual } from "lodash";


// text
export const SET_TEXT_NODE_VALUE = "SET_TEXT_NODE_VALUE";

// parent node
export const INSERT_CHILD_NODE = "INSERT_CHILD_NODE";
export const REMOVE_CHILD_NODE = "REMOVE_CHILD_NODE";
export const MOVE_CHILD_NODE   = "MOVE_CHILD_NODE";

// elements
export const SET_ATTRIBUTE_VALUE = "SET_ATTRIBUTE_VALUE";
export const ATTACH_SHADOW = "ATTACH_SHADOW";
export const REMOVE_SHADOW = "REMOVE_SHADOW";
export const MOVE_ATTRIBUTE = "MOVE_ATTRIBUTE";

// CSS Grouping
export const CSS_INSERT_RULE = "CSS_INSERT_RULE";
export const CSS_DELETE_RULE = "CSS_DELETE_RULE";
export const CSS_MOVE_RULE   = "CSS_MOVE_RULE";

// CSS Style Rule
export const CSS_SET_STYLE_PROPERTY = "CSS_SET_STYLE_PROPERTY";
export const CSS_SET_SELECTOR_TEXT = "CSS_SET_SELECTOR_TEXT";

// CSS At Rule
export const CSS_AT_RULE_SET_PARAMS = "CSS_AT_RULE_SET_PARAMS";

export type SetTextNodeValueMutation = {} & SetValueMutation<VMObjectSource>;

export const diffNode = weakMemo((oldNode: SlimBaseNode, newNode: SlimBaseNode, path: any[] = []) => {
  switch(oldNode.type) {
    case SlimVMObjectType.TEXT: return diffTextNode(oldNode as SlimTextNode, newNode as SlimTextNode, path);
    case SlimVMObjectType.ELEMENT: return diffElement(oldNode as SlimElement, newNode as SlimElement, path);
    case SlimVMObjectType.DOCUMENT: 
    case SlimVMObjectType.DOCUMENT_FRAGMENT: return diffDocumentFragment(oldNode as SlimParentNode, newNode as SlimParentNode, path);
    default: {
      throw new Error(`Unable to diff`);
    }
  }
});

const diffTextNode = (oldNode: SlimTextNode, newNode: SlimTextNode, path) => {
  if(oldNode.value !== newNode.value) {
    return [createSetValueMutation(SET_TEXT_NODE_VALUE, path, newNode.value)];
  }
};

const diffElement = (oldElement: SlimElement, newElement: SlimElement, path: any[]): Mutation<any[]>[] => {
  const diffs: Mutation<any[]>[] = [];

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
          createPropertyMutation(SET_ATTRIBUTE_VALUE, path, value.name, value.value, null, null, index)
        );
      },
      delete({ index, value }) {
        diffs.push(createPropertyMutation(SET_ATTRIBUTE_VALUE, path, value.name, null));
      },
      update({ index, newValue, originalOldIndex, patchedOldIndex }) {
        const oldAttrValue = oldElement.attributes[originalOldIndex].value;
        if (!isEqual(newValue.value, oldAttrValue) || index !== patchedOldIndex) {
          diffs.push(createPropertyMutation(SET_ATTRIBUTE_VALUE, path, newValue.name, newValue.value, null, null, index));
        }
      }
    }
  );

  if (oldElement.tagName === "style") {
    diffs.push(
      ...diffCSSRule((oldElement as SlimStyleElement).sheet, (newElement as SlimStyleElement).sheet, [...path, "sheet"])
    );
  }

  diffs.push(
    ...diffChildNodes(oldElement, newElement, path)
  );

  if (oldElement.shadow && newElement.shadow) {
    diffs.push(
      ...diffDocumentFragment(oldElement.shadow, newElement.shadow, [...path, "shadow"])
    );
  } else if (oldElement.shadow && !newElement.shadow) {
    diffs.push(
      createSetValueMutation(REMOVE_SHADOW, path, null)
    );
  } else if (!oldElement.shadow && newElement.shadow) {
    diffs.push(
      createSetValueMutation(ATTACH_SHADOW, path, compressRootNode(newElement.shadow))
    );
  }

  return diffs;
};

const diffDocumentFragment = (oldParent: SlimParentNode, newParent: SlimParentNode, path: any[]): Mutation<any[]>[] => {
  return diffChildNodes(oldParent, newParent, path);
};

const diffChildNodes = (oldParent: SlimParentNode, newParent: SlimParentNode, path: any[]): Mutation<any[]>[] => {
  const diffs: Mutation<any[]>[] = [];

  eachArrayValueMutation(
    diffArray(oldParent.childNodes, newParent.childNodes, compareNodeDiffs),
    {
      insert({ index, value }) {
        diffs.push(
          createInsertChildMutation(
            INSERT_CHILD_NODE,
            path,
            compressRootNode(value),
            index
          )
        )
      },
      delete({ index, value }) {
        diffs.push(
          createRemoveChildMutation(
            REMOVE_CHILD_NODE,
            path,
            null,
            index
          )
        );
      },
      update({ index, newValue, originalOldIndex, patchedOldIndex }) {
        if (index !== patchedOldIndex) {
          diffs.push(createMoveChildMutation(MOVE_CHILD_NODE, path, null, index, patchedOldIndex));
        }
        diffs.push(
          ...diffNode(
            oldParent.childNodes[originalOldIndex],
            newValue,
            [...path, index]
          )
        );
      }
    }
  )  

  return diffs;
};

const diffCSSRule = (oldRule: SlimCSSRule, newRule: SlimCSSRule, path: any[]) => {
  switch(oldRule.type) {
    case SlimVMObjectType.STYLE_SHEET: return diffCSSStyleSheet(oldRule as SlimCSSStyleSheet, newRule as SlimCSSStyleSheet, path);
    case SlimVMObjectType.STYLE_RULE: return diffCSSStyleRule(oldRule as SlimCSSStyleRule, newRule as SlimCSSStyleRule, path);
    case SlimVMObjectType.AT_RULE: return diffCSSAtRule(oldRule as SlimCSSAtRule, newRule as SlimCSSAtRule, path);
  }
  return [];
}

const diffCSSStyleSheet = (oldSheet: SlimCSSStyleSheet, newSheet: SlimCSSStyleSheet, path: any[]) => {
  return diffCSSGroupingRuleChildren(oldSheet, newSheet, path);
}

const diffCSSStyleRule = (oldRule: SlimCSSStyleRule, newRule: SlimCSSStyleRule, path: any[]) => {
  const diffs = [];
  if (oldRule.selectorText !== newRule.selectorText) {
    diffs.push(createSetValueMutation(CSS_SET_SELECTOR_TEXT, path, newRule.selectorText));
  }
  eachArrayValueMutation(
    diffArray(Object.keys(oldRule.style), Object.keys(newRule.style), (a, b) => a === b ? 0 : -1),
    {
      insert({ index, value}) {
        diffs.push(
          createPropertyMutation(CSS_SET_STYLE_PROPERTY, path, value, newRule.style[value])
        );
      },
      delete({ index, value }) {
        diffs.push(
          createPropertyMutation(CSS_SET_STYLE_PROPERTY, path, value, undefined)
        );
      },
      update({ newValue, index, patchedOldIndex }) {
        if (newValue === "id") return;
        // TODO - move style attribute
        if (newRule.style[newValue] !== oldRule.style[newValue]) {
          diffs.push(
            createPropertyMutation(CSS_SET_STYLE_PROPERTY, path, newValue, newRule.style[newValue], null, null, index)
          );
        }
      }
    }
  )
  return diffs;
}


const diffCSSAtRule = (oldRule: SlimCSSAtRule, newRule: SlimCSSAtRule, path: any[]) => {
  const diffs = [];
  if (oldRule.params !== newRule.params) {
    diffs.push(createSetValueMutation(CSS_AT_RULE_SET_PARAMS, path, newRule.params));
  }

  diffs.push(
    ...diffCSSGroupingRuleChildren(oldRule, newRule, path)
  );

  return diffs;
}

const diffCSSGroupingRuleChildren = (oldRule: SlimCSSGroupingRule, newRule: SlimCSSGroupingRule, path: any[]) => {
  const diffs: Mutation<any[]>[] = [];

  eachArrayValueMutation(
    diffArray(oldRule.rules, newRule.rules, compareCSSRules),
    {
      insert({ index, value }) {
        diffs.push(createInsertChildMutation(CSS_INSERT_RULE, path, compressRootNode(value), index));
      },
      delete({ index }) {
        diffs.push(createRemoveChildMutation(CSS_DELETE_RULE, path, null, index));
      },
      update({ newValue, originalOldIndex, index, patchedOldIndex }) {
        if (index !== patchedOldIndex) {
          diffs.push(createMoveChildMutation(CSS_MOVE_RULE, path, null, index, patchedOldIndex));
        }
        diffs.push(
          ...diffCSSRule(
            oldRule.rules[originalOldIndex],
            newValue,
            [...path, index]
          )
        );
      }
    }
  );

  return diffs;
};

const compareCSSRules = (a: SlimCSSRule, b: SlimCSSRule) => {
  if (a.type !== b.type) {
    return -1;
  }

  if (a.type === SlimVMObjectType.STYLE_RULE) {
    return (a as SlimCSSStyleRule).selectorText === (b as SlimCSSStyleRule).selectorText ? 0 : 1;
  }

  if (a.type === SlimVMObjectType.AT_RULE) {
    return (a as SlimCSSAtRule).params === (b as SlimCSSAtRule).params ? 0 : 1;
  }

  // TODO - check media

  return 1;
};

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
};

export const patchNode = <TNode extends SlimParentNode>(root: TNode, diffs: Mutation<any[]>[]) => {

  for (let i = 0, {length} = diffs; i < length; i++) {
    const diff = diffs[i];
    const target = getVMObjectFromPath(diff.target, root);
    if (!target) {
      throw new Error(`diff ${JSON.stringify(diff)} doesn't have a matching node.`);
    }
    let newTarget = target;

    switch(diff.type) {
      case SET_TEXT_NODE_VALUE: {
        const { newValue } = diff as SetValueMutation<any>;
        newTarget = setTextNodeValue(target as SlimTextNode, newValue);
        break;
      }
      case SET_ATTRIBUTE_VALUE: {
        const { name, newValue, index } = diff as SetPropertyMutation<any>;
        newTarget = setElementAttribute(target as SlimElement, name, newValue, index);
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
      case MOVE_CHILD_NODE: {
        const { index, oldIndex } = diff as MoveChildMutation<any, any>;
        newTarget = moveChildNode(newTarget as SlimParentNode, oldIndex, index);
        break;
      }
      case CSS_SET_SELECTOR_TEXT: {
        const { newValue } = diff as SetValueMutation<any>;
        newTarget = setCSSSelectorText(newTarget as SlimCSSStyleRule, newValue);
        break;
      }
      case CSS_SET_STYLE_PROPERTY: {
        const { name, newValue, index } = diff as SetPropertyMutation<any[]>;
        newTarget = setCSSStyleProperty(newTarget as SlimCSSStyleRule, name, newValue, index);
        break;
      }
      case CSS_INSERT_RULE: {
        const { child, index } = diff as InsertChildMutation<any, any>;
        newTarget = insertCSSRule(newTarget as SlimCSSGroupingRule, uncompressRootNode(child), index);
        break;
      }
      case CSS_DELETE_RULE: {
        const { index } = diff as InsertChildMutation<any, any>;
        newTarget = removeCSSRuleAt(newTarget as SlimCSSGroupingRule, index);
        break;
      }
      case CSS_MOVE_RULE: {
        const { index, oldIndex } = diff as MoveChildMutation<any, any>;
        newTarget = moveCSSRule(newTarget as SlimCSSGroupingRule, oldIndex, index);
        break;
      }
      case CSS_AT_RULE_SET_PARAMS: {
        const { newValue } = diff as SetValueMutation<any>;
        newTarget = setCSSAtRuleSetParams(newTarget as SlimCSSAtRule, newValue);
        break;
      }
    }

    if (newTarget !== target) {
      root = replaceNestedChild(root, diff.target, newTarget);
    }
  }

  return root;
};