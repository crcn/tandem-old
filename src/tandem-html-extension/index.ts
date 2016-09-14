import { MimeTypes } from "tandem-html-extension/constants";

import { IApplication } from "tandem-common/application";

// components
import { dependency as cssPaneComponentDependency } from "./components/css-pane";
import { dependency as entityPreviewComponentDependency } from "./components/entity-preview";
import { cssColorTokenComponentFactoryDependency } from "./components/css-color-token";

// layer components
import { dependency as textLayerLabelComponentDependency } from "./components/text-layer-label";
import { dependency as elementLayerLabelComponentDependency } from "./components/element-layer-label";
import { dependency as commentLayerLabelComponentDependency } from "./components/comment-layer-label";
import { dependency as cssRuleLayerLabelComponentDependency } from "./components/css-rule-layer-label";
import { cssDeclarationLayerLabelComponentDependency }from "./components/css-declaration-layer-label";
import { cssAtRuleLayerLabelComponentDependency } from "./components/css-atrule-layer-label";
import { cssCommentLayerLabelComponentDependency } from "./components/css-comment-layer-label";

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
import { dependency as textToolDependency, editInnerHTMLDependency } from "./models/text-tool";

// key bindings
import { dependencies as keyBindingDependencies } from "./key-bindings";

import { MimeTypeDependency } from "tandem-common/dependencies";

 // entities
 import {
   htmlTextDependency,
   linkEntityDependency,
   htmlCommentDependency,
   htmlStyleEntityDependency,
   htmlDocumentFragmentDependency,
   cssRuleEntityFactoryDependency,
   defaultElementFactoyDependency,
   cssDeclarationEntityDependency,
   cssAtRuleEntityFactoryDependency,
   defaultAttributeFactoryDependency,
   cssCommentEntityFactoryDependency,
} from "./ast";

export const dependency = [

  // components
  cssPaneComponentDependency,
  entityPreviewComponentDependency,
  cssAtRuleLayerLabelComponentDependency,
  cssCommentLayerLabelComponentDependency,
  cssColorTokenComponentFactoryDependency,

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
  keyBindingDependencies,

  // entities
  htmlTextDependency,
  linkEntityDependency,
  htmlCommentDependency,
  htmlStyleEntityDependency,
  defaultElementFactoyDependency,
  htmlDocumentFragmentDependency,
  cssRuleEntityFactoryDependency,
  cssDeclarationEntityDependency,
  cssAtRuleEntityFactoryDependency,
  cssCommentEntityFactoryDependency,

  // mime types
  new MimeTypeDependency("htm", MimeTypes.HTML),
  new MimeTypeDependency("html", MimeTypes.HTML),
  new MimeTypeDependency("sfn", MimeTypes.HTML)
];

export * from "./actions";
export * from "./ast";
// export * from "./collections";
export * from "./constants";
export * from "./dependencies";
export * from "./dom";
export * from "./key-bindings";
export * from "./models";
export * from "./services";