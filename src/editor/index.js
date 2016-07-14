import './scss/modules/all.scss';
import './scss/fonts.scss';

// components
import { fragment as rootComponentFragment } from './components/root';
import { fragment as sfnStageComponentFragment } from './components/sfn-stage';
import { fragment as selectorToolComponentFragment } from './components/selector-tool';
import { fragment as dragSelectToolComponentFragment } from './components/drag-select-tool';
import { fragment as selectableToolComponentFragment } from './components/selectable-tool';

// entities
import { fragment as stringEntityFragment } from './entities/string';
import { fragment as referenceEntityFragment } from './entities/reference';

// tools
import { fragment as textToolFragment } from './tools/text';
import { fragment as pointerToolFragment } from './tools/pointer';
import { fragment as toolManagerFragment } from './tools/manager';

export const fragment = [

  rootComponentFragment,
  sfnStageComponentFragment,
  selectorToolComponentFragment,
  dragSelectToolComponentFragment,
  selectableToolComponentFragment,

  stringEntityFragment,
  referenceEntityFragment,

  textToolFragment,
  pointerToolFragment,
  toolManagerFragment,
];
