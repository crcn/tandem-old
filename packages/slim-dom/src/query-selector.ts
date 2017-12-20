import { ParentNode, Element, NodeType } from "./state";
import { weakMemo, FlattenedObjects } from "./utils";
import { parseSelector } from "./selector-parser";
import { flattenObjects } from "./index";

export const createSelectorTester = weakMemo((selector: string) => {
  const ast = parseSelector(selector);
  return (element: Element, allNodes: FlattenedObjects) => {

  };
});

export const querySelector = (selector: string, root: ParentNode) => {

  // Use querySelectorAll because of memoization.
  const matchingElements = querySelectorAll(selector, root)
  return matchingElements.length ? matchingElements[0] : null;
};

export const querySelectorAll = weakMemo((selector: string, root: ParentNode) => {
  const allNodes = flattenObjects(root);
  const testElement = createSelectorTester(selector);
  const result: Element[] = [];
  for (const id in allNodes) {
    const { parentId, value } = allNodes[id];

    // check for tag name since type may be shared with CSSOM -- this will
    // eventually change so that native types are part of nativeType instead of type here
    if (value.type === NodeType.ELEMENT && (value as Element).tagName && testElement(value as Element, allNodes)) {
      result.push(value as Element);
    }
  }

  return result;
});