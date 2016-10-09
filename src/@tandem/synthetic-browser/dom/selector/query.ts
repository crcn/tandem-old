import { getSelectorTester } from "./tester";
import { traverseTree, findTreeNode, filterTree } from "@tandem/common";
import { SyntheticDOMNode, SyntheticDOMElement } from "../markup";

export function querySelector(node: SyntheticDOMNode, selectorSource: string): SyntheticDOMElement {
  const tester = getSelectorTester(selectorSource);
  return findTreeNode(node, tester.test.bind(tester));
}

export function querySelectorAll(node: SyntheticDOMNode, selectorSource: string): SyntheticDOMElement[] {
  const tester = getSelectorTester(selectorSource);
  return filterTree(node, tester.test.bind(tester)) as SyntheticDOMElement[];
}