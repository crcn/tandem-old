import '../scss/modules/all.scss';
import '../scss/fonts.scss';

import { values as getValues } from 'lodash';

// components
import { fragment as rootComponentFragment } from '../components/root/index';
import { fragment as sfnStageComponentFragment } from '../components/sfn-stage/index';
import { fragment as selectorToolComponentFragment } from '../components/selector-tool/index';
import { fragment as dragSelectToolComponentFragment } from '../components/drag-select-tool/index';
import { fragment as selectableToolComponentFragment } from '../components/selectable-tool/index';

// tools
import { fragment as textToolFragment } from '../tools/text';
import { fragment as pointerToolFragment } from '../tools/pointer';

// services
import { fragment as toolServiceFragment } from '../services/tool';
import { fragment as backEndServiceFragment } from '../services/back-end';
import { fragment as previewServiceFragment } from '../services/preview';
import { fragment as projectServiceFragment } from '../services/project';
import { fragment as selectorServiceFragment } from '../services/selector';
import { fragment as clipboardServiceFragment } from '../services/clipboard';
import { fragment as keyBindingServiceFragment } from '../services/key-binding';
import { fragment as rootComponentRendererFragment } from '../services/root-component-renderer';

// key bindings
import { fragment as keyBindingsFragment } from '../key-bindings/index';

// bundles 
import * as htmlExtension from '../extensions/html/index';
 
export default [

  // components
  rootComponentFragment,
  sfnStageComponentFragment,
  selectorToolComponentFragment,
  dragSelectToolComponentFragment,
  selectableToolComponentFragment,

  // tools
  textToolFragment,
  pointerToolFragment,

  // key bindings
  keyBindingsFragment,

  // services
  toolServiceFragment,
  backEndServiceFragment,
  projectServiceFragment,
  previewServiceFragment,
  selectorServiceFragment,
  clipboardServiceFragment,
  keyBindingServiceFragment,
  rootComponentRendererFragment,

  // extensions
  getValues(htmlExtension)
];