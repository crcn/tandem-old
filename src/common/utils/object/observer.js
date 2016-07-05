import create from 'common/class/utils/create';

class PropertyObserver {
  constructor(target, property, listener) {
    this.target = target;
    this.property = property;
    this.listener = listener;
  }

  update() {

  }

  dispose() {

  }
}

export default class Observer {

  constructor(target) {
    this._target = target;
    this._observers = [];
  }

  observe(property, listener) {
    this._observers.push(new PropertyObserver(this._target, property, listener));

    return {
      dispose() {
        
      }
    }
  }

  update() {

  }

  static create = create;
}
