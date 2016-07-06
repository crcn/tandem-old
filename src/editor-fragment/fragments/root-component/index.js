import './index.scss';

import { ComponentFactoryFragment } from 'paperclip/fragments';
import { TemplateComponent, dom, freeze } from 'paperclip';
import StageComponent from './stage';

export default class RootEditorComponent extends TemplateComponent {
  name = 'jeff';

  static template = <div class='m-editor'>
    <StageComponent name={c=>c.name} />
  </div>;
}

export const fragment = ComponentFactoryFragment.create('rootComponentClass', RootEditorComponent);
