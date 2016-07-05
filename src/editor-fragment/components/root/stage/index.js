import './index.scss';

import { TemplateComponent, dom, createAttributeBinding } from 'paperclip';
import RegisteredComponent from 'common/components/registered';
import StageToolsComponent from './tools';

export default class StageComponent extends TemplateComponent {
  static template = <div class='m-editor-stage'>
    <RegisteredComponent ns='components/preview' entity={
      createAttributeBinding('application.rootEntity')
    } />

    <StageToolsComponent entity={
      createAttributeBinding('application.rootEntity')
    } />
  </div>;
}
