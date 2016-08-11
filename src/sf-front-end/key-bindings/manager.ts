import { IActor } from "sf-core/actors";
import { KeyBinding } from "./base";
import * as Mousetrap from "mousetrap";

export class KeyBindingManager {

  private _element: Element;
  private _mousetrap: any;
  private _keyBindings: Array<KeyBinding> = [];

  constructor(private _target: IActor, element?: Element, ...keyBindings:Array<KeyBinding>) {
    this.element = element;
    this.register(...keyBindings);
  }

  public register(...values:Array<KeyBinding>) {
    for (const value of values) {
      this._keyBindings.push(value);
      this._bind(value);
    }
    return this;
  }

  get element(): Element {
    return this._element;
  }

  set element(value: Element) {
    this._element = value;
    this._reset();
  }

  private _reset(): void {

    if (this._mousetrap) {
      for (var keyBinding of this._keyBindings) {
        this._mousetrap.unbind(keyBinding.key);
      }
    }

    this._mousetrap = Mousetrap(this._element);

    for (const keyBinding of this._keyBindings) {
      this._bind(keyBinding);
    }
  }

  private _bind(value: KeyBinding) {
    if (!this._mousetrap) return;
    this._mousetrap.bind(value.key, () => {
      this._target.execute(value.action);
    });
  }
}