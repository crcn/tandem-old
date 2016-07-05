import './index.scss';

import { TemplateComponent, dom, createBinding } from 'paperclip';
import RegisteredComponent from 'common/components/registered';

export default class StageComponent extends TemplateComponent {
  static template = <div class='m-editor-stage'>
    <RegisteredComponent ns='components/preview' entity={
      createBinding('application.rootEntity')
    } />

    {createBinding('application.rootEntity.attributes.class')}
  </div>;
}
