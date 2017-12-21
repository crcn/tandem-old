import { SlimParentNode, SlimElement, SlimVMObjectType } from "./state";
import { weakMemo, FlattenedObjects } from "./utils";
import { parseSelector } from "./selector-parser";
import { flattenObjects } from "./index";

export const createSelectorTester = weakMemo((selector: string) => {
  const code = transpileSelector(parseSelector(selector));

  return new Function(`element`, `allNodes`, code) as (element: SlimElement, allNodes: FlattenedObjects) => boolean;
});

export const querySelector = (selector: string, root: SlimParentNode) => {

  // Use querySelectorAll because of memoization.
  const matchingElements = querySelectorAll(selector, root)
  return matchingElements.length ? matchingElements[0] : null;
};

export const querySelectorAll = weakMemo((selector: string, root: SlimParentNode) => {
  const allNodes = flattenObjects(root);
  const testElement = createSelectorTester(selector);
  const result: SlimElement[] = [];
  for (const id in allNodes) {
    const { parentId, value } = allNodes[id];
    if (value.type === SlimVMObjectType.ELEMENT && (value as SlimElement).tagName && testElement(value as SlimElement, allNodes)) {
      result.push(value as SlimElement);
    }
  }

  return result;
});

const transpileSelector = weakMemo((ast: any) => {
  return "";
});