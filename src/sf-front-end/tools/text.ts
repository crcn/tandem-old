import { ApplicationServiceDependency } from 'sf-core/dependencies';
import { BaseApplicationService } from 'sf-core/services';
import { IApplication } from 'sf-core/application';

export class TextTool extends BaseApplicationService<IApplication> {

  name = 'text';
  cursor = 'text';
  icon = 'text';
  execute() {
  }
}

export const dependency = new ApplicationServiceDependency('stage-tools/text', TextTool);