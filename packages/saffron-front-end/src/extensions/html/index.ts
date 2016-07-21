
// components
import { fragment as previewComponentFragment } from './components/preview/index';
import { fragment as originStageToolComponent } from './components/origin-stage-tool/index';

// html entities
import { fragment as rootEntityFragment } from './entities/html/root';
import { fragment as textEntityFragment } from './entities/html/text';
import { fragment as groupEntityFragment } from './entities/html/group';
import { fragment as blockEntityFragment } from './entities/html/block';
import { fragment as elementEntityFragment } from './entities/html/element';
import { fragment as attributeEntityFragment } from './entities/html/attribute';

// css entities
import { fragment as styleEntityFragment } from './entities/css/style';

// entity controllers
import { fragment as importEntityControllerFragment } from './entity-controllers/import';
import { fragment as repeatEntityControllerFragment } from './entity-controllers/repeat';
import { fragment as templateEntityControllerFragment } from './entity-controllers/template';

// models
import { fragment as sfnFileModelFragment } from './models/sfn-file';

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
  styleEntityFragment,

  // models
  sfnFileModelFragment,

  // entity controllers
  importEntityControllerFragment,
  repeatEntityControllerFragment,
  templateEntityControllerFragment,

  // selection
  displaySelectionCollectionFragment
];
