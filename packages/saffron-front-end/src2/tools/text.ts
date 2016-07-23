import { ApplicationServiceFragment } from 'saffron-common/src/fragments/index';
import BaseApplicationService from 'saffron-common/src/services/base-application-service';
import IApplication from 'saffron-common/src/application/interface';

export class TextTool extends BaseApplicationService<IApplication> {

  name = 'text';
  cursor = 'text';
  icon = 'text';
  execute() {
  }
}

export const fragment = new ApplicationServiceFragment('stage-tools/text', TextTool);