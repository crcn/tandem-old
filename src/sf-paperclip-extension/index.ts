import { MimeTypes } from "./constants";
import { MimeTypeDependency } from "sf-core/dependencies";

// models
import { pcFileDependency } from "./models/pc-file";

// entities
import { } from "./ast/entities/"
export const dependency = [

  // models
  pcFileDependency,

  // mimetypes
  new MimeTypeDependency("pc", MimeTypes.PC_MIME_TYPE)
];