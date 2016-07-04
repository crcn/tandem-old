import './index.scss';

import { TemplateComponent, dom } from 'paperclip';
import RegisteredComponent from 'common/components/registered';

export default class PreviewComponent extends TemplateComponent {
  static template = <div class='m-editor-preview'>
    <RegisteredComponent ns='editor' />
  </div>;
}
