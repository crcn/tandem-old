import View from './view';


export default class Template {
  constructor(section, hydrators) {
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

  createView(context = {}) {
    var view = this._recycling.pop();
    if (view) {
      view.context = context;
    } else {
      view = new View(context, this._section.clone(), this._hydrators, this._recycling);
    }

    return view;
  }
}
