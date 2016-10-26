import * as Mousetrap from "mousetrap";
import { toArray } from "@tandem/common/utils/array";
import { KeyBinding } from "@tandem/editor/browser/key-bindings";
import { KeyCommandAction } from "../actions";
import { InitializeAction } from "@tandem/common/actions";
import { IEditorBrowserConfig } from "@tandem/editor/browser/config";
import { CoreApplicationService } from "@tandem/core";
import { Action, IActor, IFactory } from "@tandem/common";
import { GlobalKeyBindingDependency } from "@tandem/editor/browser/dependencies";

export class GlobalKeyBindingService extends CoreApplicationService<IEditorBrowserConfig> {

  private _manager: KeyBindingManager;

  [InitializeAction.INITIALIZE]() {
    this._manager = new KeyBindingManager(this.bus, document.body);
    for (const keyBindingDependency of GlobalKeyBindingDependency.findAll(this.dependencies)) {
      this._addKeyBinding(keyBindingDependency);
    }
  }

  _addKeyBinding(dependency: GlobalKeyBindingDependency) {
    console.log("add key binding:  %s", dependency.keys.join(", "));
    for (const key of dependency.keys) {
      this._manager.register(key, dependency.create());
    }
  }
}

class KeyBindingManager {

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