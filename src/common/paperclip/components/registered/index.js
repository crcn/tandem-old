import { BaseComponent } from 'paperclip';
import PreviewComponent from 'editor-fragment'

export default class RegisteredComponent extends BaseComponent {
  initialize() {
    var { ns, application } = this.context.getProperties('application', 'ns');
    this._children = [];
    for (var fragmentFactory of application.fragmentDictionary.queryAll(ns)) {
      var child = fragmentFactory.create(Object.assign({ '[[parent]]' : this.view.context }, this.attributes));
      this._children.push(child);
      this.section.appendChild(child.toFragment());
    }
  }

  update() {
    super.update();

    for (var child of this._children) {
      child.update();
    }
  }
}
