import * as entityFragments from './entities';
import * as entityControllerFragments from './entity-controllers';
import { fragment as originStageToolFragment } from './components/origin-stage-tool';
import { fragment as displaySelectionFragment } from './selection/display-collection';
import { fragment as previewFragment } from './components/preview';


export const fragment = [
  Object.values(entityFragments),
  Object.values(entityControllerFragments),
  originStageToolFragment,
  displaySelectionFragment,
  previewFragment
];
