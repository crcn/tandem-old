import './index.scss';

import { TemplateComponent, dom } from 'paperclip';
import PreviewComponent from './preview';

export default class StageComponent extends TemplateComponent {
  static template = <div class='m-editor-stage'>
    <PreviewComponent />
  </div>;
}
