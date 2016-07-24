import { ApplicationServiceFragment } from 'sf-core/fragments';
import { BaseApplicationService } from 'sf-core/services';
import { IApplication } from 'sf-base/application';

export class TextTool extends BaseApplicationService<IApplication> {

  name = 'text';
  cursor = 'text';
  icon = 'text';
  execute() {
  }
}

export const fragment = new ApplicationServiceFragment('stage-tools/text', TextTool);