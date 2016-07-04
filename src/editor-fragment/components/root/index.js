import './index.scss';

import { FactoryFragment } from 'common/fragments';
import { TemplateComponent, dom } from 'paperclip';
import StageComponent from './stage';

export default class RootEditorComponent extends TemplateComponent {
  name = 'jeff';

  static template = <div class='m-editor'>
    <StageComponent name={c=>c.name} />
  </div>;
}

export const fragment = FactoryFragment.create('rootComponentClass', RootEditorComponent);
