import BaseApplicationService from 'saffron-common/src/services/base-application-service';
import { SelectAction } from 'saffron-front-end/src/actions/index';
import { ApplicationServiceFragment } from 'saffron-common/src/fragments/index';
import { IActor } from 'saffron-common/src/actors/index';
import IApplication from 'saffron-common/src/application/interface';

export default class PointerTool extends BaseApplicationService<IApplication> {

  name = 'pointer';
  main = true;
  icon = 'cursor';
  stageCanvasMouseDown() {
    this.bus.execute(new SelectAction());
  }
}

export const fragment = new ApplicationServiceFragment('stage-tools/pointer', PointerTool, 99);
