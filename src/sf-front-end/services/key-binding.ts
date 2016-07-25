import { IApplication } from 'sf-core/application';

import { Logger } from 'sf-core/logger';
import { loggable } from 'sf-core/decorators';
import { BaseApplicationService } from 'sf-core/services';
import { ApplicationServiceFragment } from 'sf-core/fragments';

import { KeyBinding } from 'sf-front-end/key-bindings/base';
import { KeyBindingFragment } from 'sf-front-end/fragments';

import * as Mousetrap from 'mousetrap';

@loggable()
export default class KeyBindingService extends BaseApplicationService<IApplication> {

  public logger:Logger;

  initialize() {
    for (const keyBindingFragment of KeyBindingFragment.findAll(this.app.fragments)) {
      this._addKeyBinding(keyBindingFragment.keyBinding);
    }
  }

  _addKeyBinding(keyBinding:KeyBinding) {
    this.logger.verbose('add key %s', keyBinding.key);
    Mousetrap.bind(keyBinding.key, (event) => {
      this.logger.verbose('handle key %s', keyBinding.key);
      this.bus.execute(keyBinding.action);
      event.preventDefault();
    });
  }
}

export const fragment = new ApplicationServiceFragment('key-binding', KeyBindingService);
