import './index.scss';

import { TemplateComponent, dom } from 'paperclip';
import RegisteredComponent from 'common/components/registered';
import StageToolsComponent from './tools';

export default class StageComponent extends TemplateComponent {
  static template = <div class='m-editor-stage'>
    <RegisteredComponent ns='components/preview' entity={function(context) {
      return context.application.rootEntity;
    }} />

    <StageToolsComponent entity={function(context) {
      return context.application.rootEntity;
    }} />
  </div>;
}
