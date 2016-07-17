
// components
import { fragment as previewComponentFragment } from './components/preview';
import { fragment as originStageToolComponent } from './components/origin-stage-tool';

// entities
import { fragment as rootEntityFragment } from './entities/root';
import { fragment as textEntityFragment } from './entities/text';
import { fragment as groupEntityFragment } from './entities/group';
import { fragment as blockEntityFragment } from './entities/block';
import { fragment as elementEntityFragment } from './entities/element';
import { fragment as attributeEntityFragment } from './entities/attribute';

// entity controllers
import { fragment as importEntityControllerFragment } from './entity-controllers/import';
import { fragment as repeatEntityControllerFragment } from './entity-controllers/repeat';
import { fragment as templateEntityControllerFragment } from './entity-controllers/template';

// selection
import { fragment as displaySelectionCollectionFragment } from './selection/display-collection';

export const fragment = [

  // components
  previewComponentFragment,
  originStageToolComponent,

  // entities
  rootEntityFragment,
  textEntityFragment,
  groupEntityFragment,
  blockEntityFragment,
  elementEntityFragment,
  attributeEntityFragment,

  // entity controllers
  importEntityControllerFragment,
  repeatEntityControllerFragment,
  templateEntityControllerFragment,

  // selection
  displaySelectionCollectionFragment
];
