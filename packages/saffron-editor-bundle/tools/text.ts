import { FactoryFragment } from 'saffron-common/fragments';
import CoreObject from 'saffron-common/object';

export class TextTool extends CoreObject {

  name = 'text';
  cursor = 'text';
  icon = 'text';

  execute() {
  }
}

export const fragment = FactoryFragment.create({
  ns: 'stage-tools/text',
  factory: TextTool
});
