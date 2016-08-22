import { HTML_MIME_TYPE } from "sf-html-extension/constants";

 import { IApplication } from "sf-core/application";

 // components
 import { dependency as cssPaneComponentDependency } from "./components/css-pane";
 import { dependency as entityPreviewComponentDependency } from "./components/entity-preview";

 // layer components
 import { dependency as textLayerLabelComponentDependency } from "./components/text-layer-label";
 import { dependency as elementLayerLabelComponentDependency } from "./components/element-layer-label";

 // models
 import { htmlFileModelDependency } from "./models/html-file";
 import { htmlDisplayEntitySelectionDependency } from "./models/display-selection";

 // services
 import { dependency as pasteEntityService } from "./services/paste-entity";
 import { dependency as selectWithCssSelectorService } from "./services/select-with-css-selector";

 // tools
import { dependency as textToolDependency } from "./models/text-tool";

// key bindings
import { dependencies as keyBindingDependencies } from "./key-bindings";

import { MimeTypeDependency } from "sf-core/dependencies";

 // entities
 import {
   htmlTextDependency,
   htmlCommentDependency,
   htmlElementDependencies,
   htmlStyleEntityDependency,
   htmlTemplateEntityDependency,
   htmlDocumentFragmentDependency,
} from "./models/entities/html";

export const dependency = [

  // components
  cssPaneComponentDependency,
  entityPreviewComponentDependency,
  textLayerLabelComponentDependency,
  elementLayerLabelComponentDependency,

  // services
  pasteEntityService,
  selectWithCssSelectorService,

  // models
  htmlFileModelDependency,
  htmlDisplayEntitySelectionDependency,

  // tools
  textToolDependency,

  // key bindings
  ...keyBindingDependencies,

  // entities
  htmlTextDependency,
  htmlCommentDependency,
  htmlStyleEntityDependency,
  ...htmlElementDependencies,
  htmlTemplateEntityDependency,
  htmlDocumentFragmentDependency,

  // mime types
  new MimeTypeDependency("htm", HTML_MIME_TYPE),
  new MimeTypeDependency("html", HTML_MIME_TYPE),
  new MimeTypeDependency("sfn", HTML_MIME_TYPE)
];
