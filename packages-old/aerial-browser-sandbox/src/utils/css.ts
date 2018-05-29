import { weakMemo, ExpressionLocation } from "aerial-common2";

import {
  SyntheticWindow,
  SyntheticCSSRule,
  PaperclipState,
  SyntheticElement,
  SyntheticDocument,
  getSyntheticNodeById,
  SyntheticCSSStyleRule,
  getSyntheticNodeWindow,
  SyntheticCSSStyleSheet,
  SyntheticLightDocument,
  getSyntheticWindowChild,
  getSyntheticNodeAncestors,
  SyntheticCSSStyleDeclaration
} from "../state";

import {
  CSSRuleType,
  SEnvNodeTypes,
  matchesSelector,
  SEnvCSSRuleInterface,
  SEnvDocumentInterface,
  SEnvCSSObjectInterface,
  SEnvHTMLElementInterface,
  flattenDocumentSources,
  SEnvCSSStyleRuleInterface,
  flattenWindowObjectSources,
  SEnvCSSStyleSheetInterface,
  SEnvCSSStyleDeclarationInterface
} from "../environment";

import { INHERITED_CSS_STYLE_PROPERTIES } from "../constants";
