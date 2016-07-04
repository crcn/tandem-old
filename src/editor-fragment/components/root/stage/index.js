import './index.scss';

import { Component, dom } from 'paperclip';
import PreviewComponent from './preview';

export default class StageComponent extends Component {
  static template = <div class='m-editor-stage'>
    <PreviewComponent />
  </div>;
}
