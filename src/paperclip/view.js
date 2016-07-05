import { create as createSection } from './section';

export default class View {

  constructor(context, section, hydrators, recycling = [], parent) {
    this._context = context;

    this._bindings   = [];
    this._recycling  = recycling;
    this.parent      = parent;
    this._section = section;

    for (const hydrator of hydrators) {
      hydrator.hydrate({
        section  : section,
        view     : this,
        bindings : this._bindings
      });
    }

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
   * the context of the view
   */

  get context() {
    return this._context;
  }

  /**
   */

  set context(context) {
    this._context = context;
  }

  /**
   */

  render() {
    this.update();
    return this.section.toFragment();
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
