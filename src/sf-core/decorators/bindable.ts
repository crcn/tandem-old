import { IInvoker } from 'sf-core/actors';

// TODO
export default function bindable() {
  return (proto:IInvoker, property:string = undefined, descriptor:PropertyDecorator = undefined) => {
     var _value;
    Object.defineProperty(proto, property, {
      get() {
        return _value;
      },
      set(value) {
        _value = value;
      }
    });
  };
}