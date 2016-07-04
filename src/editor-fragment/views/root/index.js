import './index.scss';

import { FactoryFragment } from 'common/fragments';
import { Component, dom } from 'paperclip';
import StageComponent from './stage';

export default class RootEditorComponent extends Component {
  name = 'jeff';

  static template = <div class='m-editor'>
    <StageComponent name={c=>c.name} />
  </div>;
}

export const fragment = FactoryFragment.create('rootViewClass', RootEditorComponent);
