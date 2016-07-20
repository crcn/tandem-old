import { Service } from 'saffron-common/lib/services/index';
import { ClassFactoryFragment } from 'saffron-common/lib/fragments/index';
import { SelectAction } from 'saffron-front-end/src/actions/index';

export default class PointerTool extends Service {

  name = 'pointer';
  main = true;
  icon = 'cursor';

  stageCanvasMouseDown() {
    this.bus.execute(new SelectAction());
  }
}

export const fragment = new ClassFactoryFragment('stage-tools/pointer', PointerTool, 99);
