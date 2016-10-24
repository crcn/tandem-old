import { getSelectorTester } from "./tester";
import { SyntheticDOMNode, SyntheticDOMElement } from "../markup";
import { traverseTree, findTreeNode, filterTree, ITreeWalker, IWalkable } from "@tandem/common";


export function querySelector(node: SyntheticDOMNode, selectorSource: string): SyntheticDOMElement {
  const tester = getSelectorTester(selectorSource);
  return findTreeNode(node, tester.test.bind(tester)) as SyntheticDOMElement;
}

export function querySelectorAll(node: SyntheticDOMNode, selectorSource: string): SyntheticDOMElement[] {
  const tester = getSelectorTester(selectorSource);
  return filterTree(node, tester.test.bind(tester)) as SyntheticDOMElement[];
}

export interface IDOMTreeWalker extends ITreeWalker {
  stop(): boolean;
}

export function selectorMatchesElement(selector: string, element: SyntheticDOMElement): boolean {
  const tester = getSelectorTester(selector);
  return tester.test(element);
}