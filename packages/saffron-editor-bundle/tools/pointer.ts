import { Service } from 'saffron-common/lib/services/index';
import { FactoryFragment } from 'saffron-common/lib/fragments/index';
import { SelectEvent } from 'saffron-editor-bundle/selection/events';

export default class PointerTool extends Service {

  name = 'pointer';
  main = true;
  icon = 'cursor';

  stageCanvasMouseDown() {
    this.bus.execute(SelectEvent.create());
  }
}

export const fragment = new FactoryFragment({
  ns: 'stage-tools/pointer',
  priority: 99,
  factory: PointerTool
});
