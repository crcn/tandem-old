import { TemplateComponent, dom } from 'paperclip';
import { ComponentFactoryFragment } from 'paperclip/fragments';

export default class OriginToolComponent extends TemplateComponent {
  static template = <div class='m-origin-tool'>
    origin tool!
  </div>;
}

export const fragment = ComponentFactoryFragment.create('components/tools/origin', OriginToolComponent);
