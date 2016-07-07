import CoreObject from 'common/object';
import observable from 'common/object/mixins/observable';
import { CallbackBus } from 'common/busses';
import Controller from './controller';
import { default as Template } from './view-factory';
import { createVNode } from './vdom/create';
import { default as compileXMLtoJS } from './xml/compile';
import { default as freeze } from './freeze';

@observable
export class BaseComponent extends CoreObject {

  addEventListener(event, listener) {
    throw new Error('event listeners currently not supported in components');
  }

  get section() {
    return this.view.section;
  }

  setAttribute(key, value) {
    this.context[key] = value;
  }

  getAttribute(key) {
    return this.context[key];
  }

  update() {
    if (!this._initialized) {
      this._initialized = true;
      this.initialize();
    }
  }

  initialize() {

  }

  static controllerFactory = Controller;
}

export class TemplateComponent extends BaseComponent {

  static freezeNode(options) {

    var vnode = this.template;

    // template source can be a string. Parse it if this is this case
    if (typeof vnode === 'string') {
      vnode = compileXMLtoJS(vnode)(createVNode);
    }

    return vnode.freezeNode(options);
  }
}
