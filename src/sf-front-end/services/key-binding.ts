
import { Logger } from "sf-core/logger";
import { loggable } from "sf-core/decorators";
import { toArray } from "sf-core/utils/array";
import * as Mousetrap from "mousetrap";
import { KeyBinding } from "sf-front-end/key-bindings/base";
import { INITIALIZE } from "sf-core/actions";
import { IApplication } from "sf-core/application";
import { KeyBindingManager } from "sf-front-end/key-bindings";
import { BaseApplicationService } from "sf-core/services";
import { GlobalKeyBindingDependency } from "sf-front-end/dependencies";
import { ApplicationServiceDependency } from "sf-core/dependencies";

@loggable()
export default class GlobalKeyBindingService extends BaseApplicationService<IApplication> {

  public logger: Logger;
  private _manager: KeyBindingManager;

  [INITIALIZE]() {
    this._manager = new KeyBindingManager(this.app.bus, document.body);
    for (const keyBindingDependency of GlobalKeyBindingDependency.findAll(this.app.dependencies)) {
      this._addKeyBinding(keyBindingDependency);
    }
  }

  _addKeyBinding(dependency: GlobalKeyBindingDependency) {
    this.logger.verbose("add key %s", dependency.key);
    for (const key of toArray(dependency.key)) {
      this._manager.register(key, dependency.create());
    }
  }
}

export const dependency = new ApplicationServiceDependency("global-key-binding", GlobalKeyBindingService);
