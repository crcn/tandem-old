import CoreObject from 'common/object';
import observable from 'common/object/mixins/observable';
import CallbackDispatcher from 'common/dispatchers/callback';
import { default as Template } from './template';
import { default as createTemplate } from './create-template';

@observable
export default class ViewComponent extends CoreObject {

  /**
   */

  constructor(properties) {
    super(properties);
    this.attributes = {};
    this.observe(CallbackDispatcher.create(this._didChange.bind(this)));
  }

  // TODO get(key) { }

  set view(value) {
    this._view = value;
  }

  setAttribute(key, value) {
    this.attributes[key] = value;
  }

  getAttribute(key) {
    return this.attributes[key];
  }

  get view() {
    if (this._view) return this._view;
    var template = this.constructor.template;

    // template source can be a string. Parse it if this is this case
    if (!(template instanceof Template)) {
      template = createTemplate(template);
    }

    this._view = template.createView(this);
    return this._view;
  }

  get section() {
    return this.view.section;
  }

  update() {
    this.view.update();
  }

  static freeze(options) {
    return this.template.freeze(options);
  }

  _didChange() {
    this.view.update();
  }
}
