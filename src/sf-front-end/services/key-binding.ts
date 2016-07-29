import { IApplication } from "sf-core/application";

import { Logger } from "sf-core/logger";
import { loggable } from "sf-core/decorators";
import { BaseApplicationService } from "sf-core/services";
import { ApplicationServiceDependency } from "sf-core/dependencies";

import { KeyBinding } from "sf-front-end/key-bindings/base";
import { KeyBindingDependency } from "sf-front-end/dependencies";

import * as Mousetrap from "mousetrap";

@loggable()
export default class KeyBindingService extends BaseApplicationService<IApplication> {

  public logger: Logger;

  initialize() {
    for (const keyBindingDependency of KeyBindingDependency.findAll(this.app.dependencies)) {
      this._addKeyBinding(keyBindingDependency.value);
    }
  }

  _addKeyBinding(keyBinding: KeyBinding) {
    this.logger.verbose("add key %s", keyBinding.key);
    Mousetrap.bind(keyBinding.key, (event) => {
      this.logger.verbose("handle key %s", keyBinding.key);
      this.bus.execute(keyBinding.action);
      event.preventDefault();
    });
  }
}

export const fragment = new ApplicationServiceDependency("key-binding", KeyBindingService);
