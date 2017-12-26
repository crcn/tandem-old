import { SlimParentNode, SlimElement, SlimVMObjectType } from "./state";
import { weakMemo, FlattenedObjects } from "./utils";
import { parseSelector } from "./selector-parser";
import { flattenObjects } from "./index";
import nwmatcher = require("nwmatcher");
import { getLightDomWrapper, traverseLightDOM, LightBaseNode, LightDocumentFragment, LightElement, LightParentNode, LightTextNode, getLightDocumentWrapper } from "./dom-wrap";


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

export const querySelectorAll = weakMemo((selector: string, root: SlimParentNode) => {
  const document = getLightDocumentWrapper(root);

  const tester = nwmatcher({
    document
  });

  tester.configure({ CACHING: true, VERBOSITY: false });

  const matches = [];

  traverseLightDOM(document.body, (element) => {
    if (element.nodeType === 1 && tester.match(element, selector)) {
      matches.push(element.source);
    }
  });
  
  return matches;
});
