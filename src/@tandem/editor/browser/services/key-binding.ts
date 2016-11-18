import * as Mousetrap from "mousetrap";
import { KeyBinding } from "@tandem/editor/browser/key-bindings";
import { KeyCommandAction } from "../messages";
import { IEditorBrowserConfig } from "@tandem/editor/browser/config";
import { CoreApplicationService } from "@tandem/core";
import { IDispatcher } from "@tandem/mesh";
import { GlobalKeyBindingProvider } from "@tandem/editor/browser/providers";
import { Action, IFactory, toArray, InitializeRequest, loggable, Logger, ICommand } from "@tandem/common";

@loggable()
export class GlobalKeyBindingService extends CoreApplicationService<IEditorBrowserConfig> {

  readonly logger: Logger;

  private _manager: KeyBindingManager;

  [InitializeRequest.INITIALIZE]() {
    this._manager = new KeyBindingManager(this.bus, document.body);
    for (const keyBindingProvider of GlobalKeyBindingProvider.findAll(this.injector)) {
      this._addKeyBinding(keyBindingProvider);
    }
  }

  _addKeyBinding(dependency: GlobalKeyBindingProvider) {
    this.logger.debug("add key binding: ", dependency.keys.join(", "));
    for (const key of dependency.keys) {
      this._manager.register(key, dependency.create());
    }
  }
}

class KeyBindingManager {

  private _element: Element;
  private _mousetrap: any;
  private _keyBindings: any = {};

  constructor(private _target: IDispatcher<any, any>, element?: Element) {
    this.element = element;
  }

  public register(key: string, command: ICommand) {
    this._keyBindings[key] = command;
    this._bind(key, command);
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

  private _bind(key: string, command: ICommand) {
    if (!this._mousetrap) return;
    this._mousetrap.bind(key, function (event) {
      if (event.target.dataset.mousetrap || /input|textarea/i.test(event.target.nodeName) || event.target.contentEditable === "true") return;
      event.preventDefault();
      command.execute(new KeyCommandAction(key));
    });
  }
}