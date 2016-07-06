import create from 'common/utils/class/create';

export default class ObservableDispatcher {

  constructor(target) {
    this._target = target || this;

    this._listeners = [];
  }

  get target() {
    return this._target;
  }

  observe(listener) {

    var listeners;

    if (listener.type) {
      if (!this._typeListeners) {
        this._typeListeners = {};
      }

      if (!this._typeListeners[listener.type]) {
        this._typeListeners[listener.type] = [];
      }

      listeners = this._typeListeners[listener.type];
    } else {
      if (!this._listeners) {
        this._listeners = [];
      }
      listeners = this._listeners;
    }

    listeners.push(listener);

    return {
      dispose() {
        var i = listeners.indexOf(listener);
        if (!!~i) listeners.splice(i, 1);
      }
    }
  }

  dispatch(event) {

    event.currentTarget = this._target;

    if (this._listeners) {
      for (var i = this._listeners.length; i--;) {
        this._listeners[i].dispatch(event);
      }
    }

    if (this._typeListeners && this._typeListeners[event.type]) {
      var listeners = this._typeListeners[event.type]
      for (var i = listeners.length; i--;) {
        listeners[i].dispatch(event);
      }
    }

    return event;
  }

  static create = create;
}
