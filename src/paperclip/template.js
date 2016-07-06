import View from './view';

export default class Template {
  constructor({ section, hydrators }) {

    this._section   = section;
    this._hydrators = hydrators;
    this._recycling = [];
  }

  get hydrators() {
    return this._hydrators;
  }

  get section() {
    return this._section;
  }

  createView(context = {}, options = {}) {
    var view = this._recycling.pop();
    if (view) {
      view.context = context;
    } else {
      view = new View({
        context: context,
        section: this._section.clone(),
        hydrators: this._hydrators,
        recycling: this._recycling,
        application: options.application,
        parent   : options.parent,
        runloop  : options.runloop
      });
    }

    return view;
  }
}
