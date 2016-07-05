import CoreObject from 'common/object';
import observable from 'common/object/mixins/observable';
import CallbackDispatcher from 'common/dispatchers/callback';
import { default as Template } from './template';
import { createVNode } from './vdom/create';
import { default as compileXMLtoJS } from './xml/compile';
import { default as freeze } from './freeze';
import { default as createTemplate } from './create-template';

@observable
export class BaseComponent extends CoreObject {
  constructor(properties) {
    super(properties);
    this.attributes = {};
  }

  get section() {
    return this.view.section;
  }

  setAttribute(key, value) {
    this.attributes[key] = value;
  }

  getAttribute(key) {
    return this.attributes[key];
  }

  update() {
    if (!this._initialized) {
      this._initialized = true;
      this.initialize();
    }
  }

  initialize() {

  }
}

export class TemplateComponent extends BaseComponent {

  /**
   */

  constructor(properties = {}) {
    super(properties);
  }

  static freeze(options) {

    var vnode = this.template;

    // template source can be a string. Parse it if this is this case
    if (typeof vnode === 'string') {
      vnode = compileXMLtoJS(vnode)(createVNode);
    }

    return vnode.freeze(options);
  }
}
