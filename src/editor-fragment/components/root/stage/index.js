import './index.scss';

import { TemplateComponent, dom, createAttributeBinding } from 'paperclip';
import RegisteredComponent from 'common/components/registered';

export default class StageComponent extends TemplateComponent {
  static template = <div class='m-editor-stage'>
  <RegisteredComponent ns='components/preview' entity={
    createAttributeBinding('application.rootEntity')
  } />

  <RegisteredComponent ns='components/tools/**' entity={
    createAttributeBinding('application.rootEntity')
  } />
  </div>;
}
