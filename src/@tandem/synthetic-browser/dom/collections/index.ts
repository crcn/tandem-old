import { SyntheticDOMNode } from "../markup";

// https://developer.mozilla.org/en-US/docs/Web/API/HTMLCollection
export class SyntheticHTMLCollection<T extends SyntheticDOMNode> extends Array<T> {
  constructor(...nodes: Array<T>) {
    super(...nodes);
  }

  item(index: number) {
    return this[index];
  }
}