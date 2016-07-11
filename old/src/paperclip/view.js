import { create as createSection } from './section';

export default class View {

  constructor({ context, section, hydrators, recycling, parent }) {

    this.context = context;
    this._bindings   = [];
    this._recycling  = recycling;
    this.parent      = parent;
    this._section    = section;

    for (const hydrator of hydrators) {
      hydrator.hydrate({
        section  : section,
        view     : this,
        bindings : this._bindings
      });
    }
  }

  set parent(value) {
    this._parent = value;
  }

  get parent() {
    return this._parent;
  }

  toString() {
    return this.section.toString();
  }

  /**
   */

  toFragment() {
    return this._section.toFragment();
  }

  /**
   */

  get section() {
    return this._section;
  }

  /**
   */

  render() {
    this.update();
    return this.section.toFragment();
  }

  /**
   */

  execute(event) {
    this.update();
  }

  /**
   * updates the
   */

  update() {
      for (var binding of this._bindings) {
        binding.update();
      }
  }

  /**
   * removes the view nodes from the parent.
   */

  remove() {
    this._section.remove();
  }

  /**
   */

  dispose() {
    this.remove();
    this._recycling.push(this);
  }
}
