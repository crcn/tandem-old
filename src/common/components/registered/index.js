import { BaseComponent } from 'paperclip';
import PreviewComponent from 'editor-fragment'

export default class RegisteredComponent extends BaseComponent {
  initialize() {
    var { ns } = this.attributes;
    this._children = [];

    for (var fragmentFactory of this.application.fragmentDictionary.queryAll(ns)) {
      var child = fragmentFactory.create({ application: this.application });
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
