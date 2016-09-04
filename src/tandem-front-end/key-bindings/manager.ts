import { IActor } from "tandem-common/actors";
import { IFactory } from "tandem-common/dependencies";
import * as Mousetrap from "mousetrap";
import { KeyBinding } from "./base";
import { KeyCommandAction } from "../actions";

export class KeyBindingManager {

  private _element: Element;
  private _mousetrap: any;
  private _keyBindings: any = {};

  constructor(private _target: IActor, element?: Element) {
    this.element = element;
  }

  public register(key: string, actor: IActor) {
    this._keyBindings[key] = actor;
    this._bind(key, actor);
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
      for (const key in this._keyBindings) {
        this._mousetrap.unbind(key);
      }
    }

    this._mousetrap = Mousetrap(this._element);

    for (const key in this._keyBindings) {
      this._bind(key, this._keyBindings[key]);
    }
  }

  private _bind(key: string, actor: IActor) {
    if (!this._mousetrap) return;
    this._mousetrap.bind(key, function (event) {
      if (event.target.dataset.mousetrap || /input|textarea/i.test(event.target.nodeName) || event.target.contentEditable === "true") return;
      event.preventDefault();
      actor.execute(new KeyCommandAction(key));
    });
  }
}