import { PropertyChangeAction } from "@tandem/common/actions";
import { IObservable, Observable } from "@tandem/common/observable";


export function bindable(bubbles: boolean = false) {
  return (proto: IObservable, property: string = undefined, descriptor: PropertyDescriptor = undefined) => {
    Object.defineProperty(proto, property, {
      get() {
        return this[`__${property}`];
      },
      set(newValue) {
        const oldValue = this[`__${property}`];
        this[`__${property}`] = newValue;
        if (oldValue !== newValue) {
          this.notify(new PropertyChangeAction(property, newValue, oldValue, bubbles));
        }
      }
    });
  };
}
