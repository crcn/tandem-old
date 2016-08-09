
 import { IApplication } from "sf-core/application";

 // components
 import { dependency as entityPreviewComponentDependency } from "./components/entity-preview";

 // models
 import { dependency as sfFileActiveRecordDependency } from "./active-records/sf-file";

 // commands
 import { dependency as pasteCommandDependency } from "./commands/paste";

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

  // entities
  htmlTextDependency,
  htmlCommentDependency,
  htmlDocumentDependency,
  ...htmlElementDependencies,
  htmlTemplateEntityDependency,

];
