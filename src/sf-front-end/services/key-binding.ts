import { IApplication } from "sf-core/application";

import { Logger } from "sf-core/logger";
import { loggable } from "sf-core/decorators";
import { BaseApplicationService } from "sf-core/services";
import { KeyBindingManager } from "sf-front-end/key-bindings";
import { ApplicationServiceDependency } from "sf-core/dependencies";

import { KeyBinding } from "sf-front-end/key-bindings/base";
import { GlobalKeyBindingDependency } from "sf-front-end/dependencies";

import * as Mousetrap from "mousetrap";

@loggable()
export default class GlobalKeyBindingService extends BaseApplicationService<IApplication> {

  public logger: Logger;
  private _manager: KeyBindingManager;

  initialize() {
    this._manager = new KeyBindingManager(this.app.bus, document.body);
    for (const keyBindingDependency of GlobalKeyBindingDependency.findAll(this.app.dependencies)) {
      this._addKeyBinding(keyBindingDependency.value);
    }
  }

  _addKeyBinding(keyBinding: KeyBinding) {
    this.logger.verbose("add key %s", keyBinding.key);
    this._manager.register(keyBinding);
  }
}

export const dependency = new ApplicationServiceDependency("global-key-binding", GlobalKeyBindingService);
