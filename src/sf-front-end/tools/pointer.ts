import { IActor } from 'sf-core/actors';
import { IApplication } from 'sf-core/application';
import { SelectAction } from 'sf-front-end/actions';
import { ApplicationServiceDependency } from 'sf-core/dependencies';
import { BaseApplicationService } from 'sf-core/services';

export default class PointerTool extends BaseApplicationService<IApplication> {

  name = 'pointer';
  main = true;
  icon = 'cursor';
  stageCanvasMouseDown() {
    this.bus.execute(new SelectAction());
  }
}

export const fragment = new ApplicationServiceDependency('stage-tools/pointer', PointerTool);
