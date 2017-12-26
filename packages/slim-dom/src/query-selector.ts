import { SlimParentNode, SlimElement, SlimVMObjectType } from "./state";
import { weakMemo, FlattenedObjects } from "./utils";
import { parseSelector } from "./selector-parser";
import { flattenObjects, SlimBaseNode } from "./index";
import nwmatcher = require("nwmatcher");
import { getLightDomWrapper, traverseLightDOM, LightBaseNode, LightDocumentFragment, LightElement, LightParentNode, LightTextNode, getLightDocumentWrapper, LightDocument } from "./dom-wrap";


const fakeWindow = {
  document: {
    hasFocus: false,
  }
}

export const querySelector = (selector: string, root: SlimParentNode) => {

  // Use querySelectorAll because of memoization.
  const matchingElements = querySelectorAll(selector, root)
  return matchingElements.length ? matchingElements[0] : null;
};

const ownerDocument = new LightDocument();

const queryTester = nwmatcher({
  document: ownerDocument
});

queryTester.configure({ CACHING: true, VERBOSITY: false });

export const querySelectorAll = weakMemo((selector: string, node: SlimBaseNode) => {
  const wrappedNode = getLightDomWrapper(node);
  wrappedNode.ownerDocument = ownerDocument;
  
  const matches = [];

  if (wrappedNode.nodeType === 1 && queryTester.match(wrappedNode, selector)) {
    matches.push(node);
  };

  if ((node as SlimParentNode).childNodes) {
    const parent = node as SlimParentNode;
    for (let i = 0, {length} = parent.childNodes; i < length; i++) {
      matches.push(...querySelectorAll(selector, parent.childNodes[i]));
    }
  }

  return matches;
});
