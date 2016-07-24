import BaseApplicationService from 'sf-common/services/base-application-service';
import { SelectAction } from 'sf-front-end/actions/index';
import { ApplicationServiceFragment } from 'sf-common/fragments/index';
import { IActor } from 'sf-common/actors/index';
import IApplication from 'sf-common/application/interface';

export default class PointerTool extends BaseApplicationService<IApplication> {

  name = 'pointer';
  main = true;
  icon = 'cursor';
  stageCanvasMouseDown() {
    this.bus.execute(new SelectAction());
  }
}

export const fragment = new ApplicationServiceFragment('stage-tools/pointer', PointerTool, 99);
