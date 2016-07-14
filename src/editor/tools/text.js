import { ApplicationFragment } from 'common/application/fragments';
import CoreObject from 'common/object';

export class TextTool extends CoreObject {

  cursor = 'text';

  execute() {
  }
}

export const fragment = [
  ApplicationFragment.create({
    ns: 'application/initTextTool',
    initialize: initTextTool,
  }),
];

function initTextTool() {
}
