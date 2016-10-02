
import { Logger } from "@tandem/common/logger";
import { loggable } from "@tandem/common/decorators";
import { toArray } from "@tandem/common/utils/array";
import * as Mousetrap from "mousetrap";
import { KeyBinding } from "@tandem/front-end/key-bindings/base";
import { IApplication } from "@tandem/common/application";
import { InitializeAction } from "@tandem/common/actions";
import { KeyBindingManager } from "@tandem/front-end/key-bindings";
import { BaseApplicationService } from "@tandem/common/services";
import { GlobalKeyBindingDependency } from "@tandem/front-end/dependencies";
import { ApplicationServiceDependency } from "@tandem/common/dependencies";

@loggable()
export default class GlobalKeyBindingService extends BaseApplicationService<IApplication> {

  public logger: Logger;
  private _manager: KeyBindingManager;

  [InitializeAction.INITIALIZE]() {
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

export const keyBindingsServiceDependency = new ApplicationServiceDependency("global-key-binding", GlobalKeyBindingService);
