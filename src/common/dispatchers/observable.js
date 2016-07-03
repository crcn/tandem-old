import create from 'common/class/utils/create';

export default class ObservableDispatcher {

  constructor(target) {
    this._target = target || this;
  }

  get target() {
    return this._target;
  }

  observe(listener) {
    if (!this._listeners) {
      this._listeners = [];
    }

    this._listeners.push(listener);

    return {
      dispose: () => {
        var i = this._listeners.indexOf(listener);
        if (!!~i) this._listeners.splice(i, 1);
      }
    }
  }

  dispatch(event) {

    event.currentTarget = this._target;

    for (var listener of this._listeners) {
      listener.dispatch(event);
    }
  }

  static create = create;
}
