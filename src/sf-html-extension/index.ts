
 import { IApplication } from "sf-core/application";

 // components
 import { fragment as entityPreviewComponentDependency } from "./components/entity-preview";

 // models
 import { fragment as sfFileActiveRecordDependency } from "./active-records/sf-file";

 // entities
 import {
   htmlTextDependency,
   htmlCommentDependency,
   htmlDocumentDependency,
   htmlElementDependencies,
   htmlTemplateEntityDependency
} from "./entities/html";

export const fragment = [

  // components
  entityPreviewComponentDependency,

  // models
  sfFileActiveRecordDependency,

  // entities
  htmlTextDependency,
  htmlCommentDependency,
  htmlDocumentDependency,
  ...htmlElementDependencies,
  htmlTemplateEntityDependency,

];
