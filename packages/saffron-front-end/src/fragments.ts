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

// models
import { fragment as sfnFileModelFragment } from './models/sfn-file';

// services
import { fragment as toolServiceFragment } from './services/tool';
import { fragment as backEndServiceFragment } from './services/back-end';
import { fragment as previewServiceFragment } from './services/preview';
import { fragment as projectServiceFragment } from './services/project';
import { fragment as selectorServiceFragment } from './services/selector';
import { fragment as clipboardServiceFragment } from './services/clipboard';
import { fragment as keyBindingServiceFragment } from './services/key-binding';
import { fragment as rootComponentRendererFragment } from './services/root-component-renderer';

// key bindings
import { fragment as keyBindingsFragment } from './key-bindings/index';

// bundles 
import { fragment as htmlBundleFragment } from 'saffron-html-bundle';
 
export default [

  // components
  rootComponentFragment,
  sfnStageComponentFragment,
  selectorToolComponentFragment,
  dragSelectToolComponentFragment,
  selectableToolComponentFragment,

  // entities
  stringEntityFragment,
  referenceEntityFragment,

  // tools
  textToolFragment,
  pointerToolFragment,

  // models
  sfnFileModelFragment,

  // key bindings
  keyBindingsFragment,

  // services
  toolServiceFragment,
  projectServiceFragment,
  previewServiceFragment,
  selectorServiceFragment,
  clipboardServiceFragment,
  keyBindingServiceFragment,

  // bundles
  htmlBundleFragment
];
