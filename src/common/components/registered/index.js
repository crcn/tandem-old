export default class RegisteredComponent {

  constructor({ view }) {
    this.view = view;
  }

  setAttribute(key, value) {
    this[key] = value;
  }

  update() {
    // update something
    console.log('update it!', this.ns);
    this.view.section.appendChild(document.createTextNode('some registered component'));
  }
}
