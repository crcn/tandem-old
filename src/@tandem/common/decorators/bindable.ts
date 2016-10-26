import { IActor } from "@tandem/common/actors";
import { WrapBus } from "mesh";
import { IObservable, Observable } from "@tandem/common/observable";
import { Action, PropertyChangeAction } from "@tandem/common/actions";

function shouldBubbleActions(proto: any, property: string) {
  return proto[`$bubbleActions$${property}`];
}

export function bindable(bubbles: boolean = false) {

  class BindableValue {
    private _value: any;
    private _shouldBubbleActions: boolean;
    private _valueObserver: IActor;

    constructor(readonly target: IObservable, readonly property: string) {
      if (shouldBubbleActions(target, property)) {
        this._valueObserver = new WrapBus(this.onValueAction.bind(this));
      }
    }

    getValue() {
      return this._value;
    }

    setValue(value: any) {
      if (this._valueObserver && this._value && this._value.unobserve) {
        (<IObservable>this._value).unobserve(this._valueObserver);
      }
      this._value = value;
      if (this._valueObserver && this._value && this._value.observe) {
        (<IObservable>this._value).observe(this._valueObserver);
      }
    }

    private onValueAction(action: Action) {
      this.target.notify(action);
    }
  }

  return (proto: IObservable, property: string = undefined, descriptor: PropertyDescriptor = undefined) => {

    function getBindableValue(proto): BindableValue {
      return proto[`$binding$${property}`] || (proto[`$binding$${property}`] = new BindableValue(proto, property));
    }

    Object.defineProperty(proto, property, {
      get() {
        return getBindableValue(this).getValue();
      },
      set(newValue) {
        const bv = getBindableValue(this);
        const oldValue = bv.getValue();
        if (oldValue !== newValue) {
          bv.setValue(newValue);
          this.notify(new PropertyChangeAction(property, newValue, oldValue, bubbles));
        }
      }
    });
  };
}

export function bubble() {
  return (proto: IObservable, property: string = undefined, descriptor: PropertyDescriptor = undefined) => {
    proto[`$bubbleActions$${property}`] = true;
  };
}