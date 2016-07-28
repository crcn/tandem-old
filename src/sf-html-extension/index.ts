
 import { IApplication } from 'sf-core/application';

 // components
 import { fragment as entityPreviewComponentFragment } from './components/entity-preview';

 // models
 import { fragment as sfFileModelFragment } from './models/sf-file';

 // entities
 import {
   htmlTextFragment,
   htmlCommentFragment,
   htmlDocumentFragment,
   htmlElementFragments,
   htmlTemplateEntityFragment
} from './entities/html';

export const fragment = [

  // components
  entityPreviewComponentFragment,

  // models
  sfFileModelFragment,

  // entities
  htmlTextFragment,
  htmlCommentFragment,
  htmlDocumentFragment,
  ...htmlElementFragments,
  htmlTemplateEntityFragment,

];
