
import { BaseComponent } from 'paperclip';

export default class RegisteredComponent extends BaseComponent {

  constructor(properties) {
    super(properties);
  }

  update() {
    // update something
    console.log('update it!', this.ns);
    this.view.section.appendChild(document.createTextNode('some registered component'));
  }
}
