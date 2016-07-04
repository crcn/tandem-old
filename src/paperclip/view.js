import { create as createSection } from './section';

export default class View {

  constructor(context, node, hydrators) {
    this._context = context;

    this._bindings = [];

    for (const hydrator of hydrators) {
      hydrator.hydrate({
        node     : node,
        context  : context,
        bindings : this._bindings
      });
    }

    this._section = createSection(node);

    this.update();
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
    // recycle back to template
  }
}
