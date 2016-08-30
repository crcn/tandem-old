import { MimeTypes } from "./constants";
import { MimeTypeDependency } from "sf-core/dependencies";

// entities
import { bcBlockNodeEntityDependency } from "./ast";

// models
import { pcFileDependency } from "./models/pc-file";

export const dependency = [

   // entities
   bcBlockNodeEntityDependency,

  // models
  pcFileDependency,

  // mimetypes
  new MimeTypeDependency("pc", MimeTypes.PC_MIME_TYPE)
];