import { MimeTypes } from "tandem-html-extension/constants";

import { IApplication } from "tandem-common/application";

// components
import { dependency as cssPaneComponentDependency } from "./components/css-pane";
import { dependency as entityPreviewComponentDependency } from "./components/entity-preview";
import { dependency as artboardToolComponentDependency } from "./components/artboard-tool";

// layer components
import { dependency as textLayerLabelComponentDependency } from "./components/text-layer-label";
import { dependency as elementLayerLabelComponentDependency } from "./components/element-layer-label";
import { dependency as commentLayerLabelComponentDependency } from "./components/comment-layer-label";
import { dependency as cssRuleLayerLabelComponentDependency } from "./components/css-rule-layer-label";

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
   htmlArtboardDependency,
   htmlStyleEntityDependency,
   htmlDocumentFragmentDependency,
   cssRuleEntityFactoryDependency,
   defaultElementFactoyDependency,
   defaultAttributeFactoryDependency,
} from "./ast";

export const dependency = [

  // components
  cssPaneComponentDependency,
  artboardToolComponentDependency,
  entityPreviewComponentDependency,

  // layer components
  textLayerLabelComponentDependency,
  commentLayerLabelComponentDependency,
  elementLayerLabelComponentDependency,
  cssRuleLayerLabelComponentDependency,
  defaultAttributeFactoryDependency,

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
  htmlArtboardDependency,
  htmlStyleEntityDependency,
  defaultElementFactoyDependency,
  htmlDocumentFragmentDependency,
  cssRuleEntityFactoryDependency,

  // mime types
  new MimeTypeDependency("htm", MimeTypes.HTML_MIME_TYPE),
  new MimeTypeDependency("html", MimeTypes.HTML_MIME_TYPE),
  new MimeTypeDependency("sfn", MimeTypes.HTML_MIME_TYPE)
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