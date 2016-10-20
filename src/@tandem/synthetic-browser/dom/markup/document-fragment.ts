import { DOMNodeType } from "./node-types";
import { IMarkupNodeVisitor } from "./visitor";
import { SyntheticDocument } from "../document";
import { SyntheticDOMContainer } from "./container";

import { serializable, ISerializer, serialize, deserialize, ISerializedContent } from "@tandem/common";

export interface ISerializedSyntheticDocumentFragment {
  childNodes: Array<ISerializedContent<any>>;
}

class SyntheticDocumentFragmentSerializer implements ISerializer<SyntheticDocumentFragment, ISerializedSyntheticDocumentFragment> {
  serialize({ childNodes }) {
    return {
      childNodes: childNodes.map(serialize)
    };
  }
  deserialize({ childNodes }) {
    const fragment = new SyntheticDocumentFragment();
    for (let i = 0, n = childNodes.length; i < n; i++) {
      fragment.appendChild(deserialize(childNodes[i]));
    }
    return fragment;
  }
}

@serializable(new SyntheticDocumentFragmentSerializer())
export class SyntheticDocumentFragment extends SyntheticDOMContainer {
  readonly nodeType: number = DOMNodeType.DOCUMENT_FRAGMENT;
  constructor() {
    super("#document-fragment");
  }
  accept(visitor: IMarkupNodeVisitor) {
    return visitor.visitDocumentFragment(this);
  }
  cloneNode(deep?: boolean) {
    const clone = new SyntheticDocumentFragment();
    if (deep === true) {
      for (const child of this.childNodes) {
        clone.appendChild(child.cloneNode(true));
      }
    }
    clone.$expression = this.expression;
    clone.$module     = this.module;
    return clone;
  }
}