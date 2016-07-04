import './index.scss';

import { Component, dom } from 'paperclip';
import RegisteredComponent from 'common/components/registered';

export default class PreviewComponent extends Component {
  static template = <div class='m-editor-preview'>
    <RegisteredComponent ns='editor' />
  </div>;
}
