import { MimeTypes } from "./constants";
import { MimeTypeDependency } from "sf-core/dependencies";

// entities
import { bcBlockNodeEntityDependency } from "./ast";

// components
import { dependency as blockNodeLayerLabelComponentDependency } from "./components/block-node-layer-label";

// models
import { pcFileDependency } from "./models/pc-file";

export const dependency = [

   // entities
   bcBlockNodeEntityDependency,

   // components
   blockNodeLayerLabelComponentDependency,

  // models
  pcFileDependency,

  // mimetypes
  new MimeTypeDependency("pc", MimeTypes.PC_MIME_TYPE)
];