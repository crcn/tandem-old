import { MimeTypes } from "tandem-html-extension/constants";
import { IApplication } from "tandem-common/application";

// components
import { cssPaneComponentDependency } from "./components/css-pane";
import { entityPreviewComponentDependency } from "./components/entity-preview";
import { cssColorTokenComponentFactoryDependency } from "./components/css-color-token";

// stage tool components
import { cssHighlightElementToolComponentFactoryDependency } from "./components/css-highlight-element-tool";

// layer components
import { textLayerLabelComponentDependency } from "./components/text-layer-label";
import { elementLayerLabelComponentDependency } from "./components/element-layer-label";
import { commentLayerLabelComponentDependency } from "./components/comment-layer-label";
import { cssRuleLayerLabelComponentDependency } from "./components/css-rule-layer-label";
import { cssAtRuleLayerLabelComponentDependency } from "./components/css-atrule-layer-label";
import { cssCommentLayerLabelComponentDependency } from "./components/css-comment-layer-label";
import { cssDeclarationLayerLabelComponentDependency } from "./components/css-declaration-layer-label";

// runtime
import {
  domCSSModuleFactoryDependency,
  domHTMLModuleFactoryDependency,
  cssModuleFactoryDependency,
  syntheticLinkComponentFactoryDependency,
} from "./runtime";

// token components
import { cssUnitEditorTokenComponentFactoryDependency } from "./components/css-unit-editor-token";
import { cssNumericEditorTokenComponentFactoryDependency } from "./components/css-numeric-editor-token";
import { cssReferenceEditorTokenComponentFactoryDependency } from "./components/css-reference-editor-token";

// models
import { cssFileDependency } from "./models/css-file";
import { htmlFileModelDependency } from "./models/html-file";

// services
import { pastHTMLServiceDependency, cssSelectorServiceDependency  } from "./services";

 // tools
import { textToolDependency, editInnerHTMLDependency } from "./models/text-tool";

// key bindings
import { keyBindingDependency } from "./key-bindings";

import { MimeTypeDependency } from "tandem-common/dependencies";

 // entities
 import {
   htmlTextDependency,
   htmlCommentDependency,
   htmlStyleEntityDependency,
   htmlDocumentFragmentDependency,
   cssRuleEntityFactoryDependency,
   defaultElementFactoyDependency,
   cssDeclarationEntityDependency,
   cssAtRuleEntityFactoryDependency,
   defaultAttributeFactoryDependency,
   cssCommentEntityFactoryDependency,
} from "./lang";

export const htmlExtensionDependency = [

  // components
  cssPaneComponentDependency,
  entityPreviewComponentDependency,
  cssAtRuleLayerLabelComponentDependency,
  cssCommentLayerLabelComponentDependency,
  cssColorTokenComponentFactoryDependency,

  // runtime
  cssModuleFactoryDependency,
  domCSSModuleFactoryDependency,
  domHTMLModuleFactoryDependency,
  syntheticLinkComponentFactoryDependency,

  // stage tool components
  cssHighlightElementToolComponentFactoryDependency,

  // layer components
  textLayerLabelComponentDependency,
  defaultAttributeFactoryDependency,
  commentLayerLabelComponentDependency,
  elementLayerLabelComponentDependency,
  cssRuleLayerLabelComponentDependency,
  cssDeclarationLayerLabelComponentDependency,

  // unit components
  cssUnitEditorTokenComponentFactoryDependency,
  cssNumericEditorTokenComponentFactoryDependency,
  cssReferenceEditorTokenComponentFactoryDependency,

  // services
  pastHTMLServiceDependency,
  cssSelectorServiceDependency,

  // models
  cssFileDependency,
  htmlFileModelDependency,

  // tools
  textToolDependency,
  editInnerHTMLDependency,

  // key bindings
  keyBindingDependency,

  // entities
  htmlTextDependency,
  htmlCommentDependency,
  htmlStyleEntityDependency,
  defaultElementFactoyDependency,
  htmlDocumentFragmentDependency,
  cssRuleEntityFactoryDependency,
  cssDeclarationEntityDependency,
  cssAtRuleEntityFactoryDependency,
  cssCommentEntityFactoryDependency,

  // mime types
  new MimeTypeDependency("css", MimeTypes.CSS),
  new MimeTypeDependency("htm", MimeTypes.HTML),
  new MimeTypeDependency("html", MimeTypes.HTML)
];

export * from "./actions";
export * from "./lang";
export * from "./constants";
export * from "./dom";
export * from "./key-bindings";
export * from "./models";
export * from "./services";