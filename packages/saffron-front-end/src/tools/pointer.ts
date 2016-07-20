import { Service } from 'saffron-common/lib/services/index';
import { ClassFactoryFragment } from 'saffron-common/lib/fragments/index';
import { SelectEvent } from 'selection/events/index';

export default class PointerTool extends Service {

  name = 'pointer';
  main = true;
  icon = 'cursor';

  stageCanvasMouseDown() {
    this.bus.execute(new SelectEvent());
  }
}

export const fragment = new ClassFactoryFragment('stage-tools/pointer', PointerTool, 99);
