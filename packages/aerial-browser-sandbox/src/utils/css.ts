import { weakMemo, ExpressionLocation } from "aerial-common2";

import { 
  SyntheticWindow, 
  SyntheticCSSRule, 
  SyntheticBrowser, 
  SyntheticElement, 
  SyntheticDocument,
  getSyntheticNodeById, 
  SyntheticCSSStyleRule,
  getSyntheticNodeWindow, 
  SyntheticCSSStyleSheet, 
  SyntheticLightDocument,
  getSyntheticWindowChild, 
  getSyntheticNodeAncestors,
  SyntheticCSSStyleDeclaration,
} from "../state";

import { 
  CSSRuleType, 
  SEnvNodeTypes,
  matchesSelector, 
  getHostDocument,
  SEnvCSSRuleInterface, 
  SEnvDocumentInterface, 
  SEnvCSSObjectInterface, 
  SEnvHTMLElementInterface,
  flattenDocumentSources,
  SEnvCSSStyleRuleInterface,
  flattenWindowObjectSources,
  SEnvCSSStyleSheetInterface, 
  SEnvCSSStyleDeclarationInterface,
} from "../environment";

import {
  INHERITED_CSS_STYLE_PROPERTIES
} from "../constants";

