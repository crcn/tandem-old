import { MimeTypes } from "./constants";
import { MimeTypeDependency } from "tandem-common/dependencies";

// entities
import {
  pcTemplateDependency,
  pcBlockNodeEntityDependency,
  pcBlockAttributeValueEntityDependency,
} from "./ast";

// components
import { dependency as blockNodeLayerLabelComponentDependency } from "./components/block-node-layer-label";
import { dependency as templateToolComponentDependency } from "./components/template-tool";

// services
import { dependency as pastePCEntitServiceyDependency } from "./services/paste-entity";

// models
import { pcFileDependency } from "./models/pc-file";

export const dependency = [

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