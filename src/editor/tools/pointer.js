import { Service } from 'common/services';
import { FactoryFragment } from 'common/fragments';
import { SelectEvent } from 'editor/selection/events';

export default class PointerTool extends Service {

  name = 'pointer';
  main = true;
  icon = 'cursor';

  stageCanvasMouseDown() {
    this.bus.execute(SelectEvent.create());
  }
}

export const fragment = FactoryFragment.create({
  ns: 'stage-tools/pointer',
  priority: 99,
  factory: PointerTool
});
