import './index.scss';
import { TemplateComponent, dom } from 'paperclip';
import { ComponentFactoryFragment } from 'paperclip/fragments';

export default class SelectorToolComponent extends TemplateComponent {
  static template = <div class='m-selector-tool'>
    Selector!
  </div>
}

export const fragment = ComponentFactoryFragment.create('components/tools/selector', SelectorToolComponent);
