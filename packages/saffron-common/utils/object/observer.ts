import create from '../../utils/class/create';

class PropertyObserver {
  public target:any;
  public property:string;
  public listener:Function;
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

  private _target:any;
  private _observers:Array<PropertyObserver>;

  constructor(target) {
    this._target = target;
    this._observers = [];
  }

  observe(property, listener) {
    this._observers.push(new PropertyObserver(this._target, property, listener));

    return {
      dispose() {

      },
    };
  }

  update() {

  }

  static create = create;
}
