import { createSelectorTester } from "./tester";
import { traverseTree, findTreeNode, filterTree } from "@tandem/common";
import { SyntheticMarkupNode, SyntheticMarkupElement } from "../markup";

export function querySelector(node: SyntheticMarkupNode, selectorSource: string): SyntheticMarkupElement {
  const tester = createSelectorTester(selectorSource);
  return findTreeNode(node, tester.test.bind(tester));
}

export function querySelectorAll(node: SyntheticMarkupNode, selectorSource: string): SyntheticMarkupElement[] {
  const tester = createSelectorTester(selectorSource);
  return filterTree(node, tester.test.bind(tester)) as SyntheticMarkupElement[];
}