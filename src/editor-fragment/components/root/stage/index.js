import './index.scss';

import { TemplateComponent, dom, createTextBinding } from 'paperclip';
import RegisteredComponent from 'common/components/registered';

export default class StageComponent extends TemplateComponent {
  static template = <div class='m-editor-stage'>
    <RegisteredComponent ns='components/preview' entity={
      createTextBinding('application.rootEntity')
    } />
  </div>;
}
