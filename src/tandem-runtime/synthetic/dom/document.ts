import { HTMLNodeType } from "./node-types";
import { SyntheticComment } from "./comment";
import { SyntheticElement } from "./element";
import { SyntheticTextNode } from "./text-node";
import { SyntheticLocation } from "./location";
import { SyntheticDocumentFragment } from "./fragment";
import { SyntheticNode, SyntheticContainerNode } from "./node";
import { synthetic, SyntheticObject, SyntheticString } from "../core";

export class SyntheticDocument extends SyntheticContainerNode {
  readonly nodeType = HTMLNodeType.DOCUMENT;

  constructor(location: SyntheticLocation) {
    super(new SyntheticString("#document"), null);
    const body = this.createElement(new SyntheticString("body"));
    this.appendChild(body);
    this.set("body", body);
    this.set("location", location);
  }

  get location(): SyntheticLocation {
    return this.get("location") as SyntheticLocation;
  }

  get body(): SyntheticElement {
    return this.get("body") as SyntheticElement;
  }

  @synthetic registerElement(tagName: SyntheticString, properties?: SyntheticObject) {
    // http://www.html5rocks.com/en/tutorials/webcomponents/customelements/
  }

  @synthetic createElement(tagName: SyntheticString) {
    return new SyntheticElement(tagName, this);
  }

  @synthetic createDocumentFragment() {
    return new SyntheticDocumentFragment(this);
  }

  @synthetic createTextNode(nodeValue: SyntheticString) {
    return new SyntheticTextNode(nodeValue, this);
  }

  @synthetic createComment(nodeValue: SyntheticString) {
    return new SyntheticComment(nodeValue, this);
  }
}