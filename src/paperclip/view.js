export default class View {

  constructor(context, node, hydrators) {
    this.node     = node;
    this._context = context;

    this._bindings = [];

    for (const hydrator of hydrators) {
      hydrator.hydrate({
        node     : node,
        context  : context,
        bindings : this._bindings
      });
    }

    this.update();
  }

  get context() {
    return this._context;
  }

  update() {
      for (var binding of this._bindings) {
        binding.update();
      }
  }
}
