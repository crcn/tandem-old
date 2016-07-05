import { BaseComponent } from 'paperclip';
import { ComponentFactoryFragment } from 'paperclip/fragments';



export default class PreviewComponent extends BaseComponent {
  initialize() {
    super.initialize();
    // this.section.appendChild(document.createTextNode('document this 🖕🏼'));
  }

  update() {
    super.update();
    var rootEntity = this.application.rootEntity;
  }
}

export const fragment = ComponentFactoryFragment.create('components/preview', PreviewComponent);
