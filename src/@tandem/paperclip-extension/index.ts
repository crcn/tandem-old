import { MimeTypes } from "./constants";
import { MimeTypeDependency } from "@tandem/common/dependencies";

// entities
import {
  pcTemplateDependency,
  pcBlockNodeEntityDependency,
  pcBlockAttributeValueEntityDependency,
} from "./lang";

// components

import { blockNodeLayerLabelComponentDependency } from "./components/block-node-layer-label";
import { templateToolComponentDependency } from "./components/template-tool";

// services
import { pastePCEntitServiceyDependency } from "./services/paste-entity";

// models
import { pcFileDependency } from "./models/pc-file";

export const paperclipExtensionDependency = [

   // entities
   pcTemplateDependency,
   pcBlockNodeEntityDependency,
   pcBlockAttributeValueEntityDependency,

   // components
   blockNodeLayerLabelComponentDependency,
   templateToolComponentDependency,

   // services
   pastePCEntitServiceyDependency,

  // models
  pcFileDependency,

  // mimetypes
  new MimeTypeDependency("pc", MimeTypes.PC_MIME_TYPE)
];