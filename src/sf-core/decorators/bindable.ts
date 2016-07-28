import { IObservable } from 'sf-core/observable';
import { PropertyChangeAction } from 'sf-core/actions';

// TODO
export default function bindable() {
  return (proto: IObservable, property: string = undefined, descriptor:PropertyDecorator = undefined) => {
    var _value;
    Object.defineProperty(proto, property, {
      get() {
        return _value;
      },
      set(value) {

        // TODO - check of value is observable
        const oldValue = _value;
        _value = value;
        this.notify(new PropertyChangeAction(property, value, oldValue));
      }
    });
  };
}