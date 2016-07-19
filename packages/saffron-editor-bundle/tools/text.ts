import { FactoryFragment } from 'saffron-common/lib/fragments/index';
import CoreObject from 'saffron-common/lib/object/index';

export class TextTool extends CoreObject {

  name = 'text';
  cursor = 'text';
  icon = 'text';

  execute() {
  }
}

export const fragment = new FactoryFragment({
  ns: 'stage-tools/text',
  factory: TextTool
});
