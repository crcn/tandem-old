import { ApplicationServiceFragment } from 'saffron-common/src/fragments/index';
import BaseApplicationService from 'saffron-common/src/services/base-application-service';

export class TextTool extends BaseApplicationService {

  name = 'text';
  cursor = 'text';
  icon = 'text';
  execute() {
  }
}

export const fragment = new ApplicationServiceFragment('stage-tools/text', TextTool);