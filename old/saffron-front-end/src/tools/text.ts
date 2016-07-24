import { ApplicationServiceFragment } from 'sf-common/fragments/index';
import BaseApplicationService from 'sf-common/services/base-application-service';
import IApplication from 'sf-common/application/interface';

export class TextTool extends BaseApplicationService<IApplication> {

  name = 'text';
  cursor = 'text';
  icon = 'text';
  execute() {
  }
}

export const fragment = new ApplicationServiceFragment('stage-tools/text', TextTool);