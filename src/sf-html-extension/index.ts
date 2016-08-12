
 import { IApplication } from "sf-core/application";

 // components
 import { dependency as entityPreviewComponentDependency } from "./components/entity-preview";

 // models
 import { dependency as sfFileActiveRecordDependency } from "./models/sf-file";

 // commands
 import { dependency as pasteCommandDependency } from "./commands/paste";

 // tools
import { dependency as textToolDependency } from "./tools/text";


import { MimeTypeDependency } from "sf-core/dependencies";

 // entities
 import {
   htmlTextDependency,
   htmlCommentDependency,
   htmlDocumentDependency,
   htmlElementDependencies,
   htmlTemplateEntityDependency
} from "./entities/html";

export const dependency = [

  // components
  entityPreviewComponentDependency,

  // commands
  pasteCommandDependency,

  // models
  sfFileActiveRecordDependency,

  // tools
  textToolDependency,

  // entities
  htmlTextDependency,
  htmlCommentDependency,
  htmlDocumentDependency,
  ...htmlElementDependencies,
  htmlTemplateEntityDependency,

  // mime types
  new MimeTypeDependency("htm", "text/html"),
  new MimeTypeDependency("html", "text/html"),
  new MimeTypeDependency("sfn", "text/html")
];
