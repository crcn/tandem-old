
 import { IApplication } from "sf-core/application";

 // components
 import { fragment as entityPreviewComponentDependency } from "./components/entity-preview";

 // models
 import { fragment as sfFileModelDependency } from "./models/sf-file";

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
  sfFileModelDependency,

  // entities
  htmlTextDependency,
  htmlCommentDependency,
  htmlDocumentDependency,
  ...htmlElementDependencies,
  htmlTemplateEntityDependency,

];
