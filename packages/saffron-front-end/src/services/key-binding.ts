import Logger from 'saffron-common/src/logger/index'; 
import loggable from 'saffron-common/src/decorators/loggable';

import IApplication from 'saffron-common/src/application/interface';
import * as Mousetrap from 'mousetrap';
import BaseApplicationService from 'saffron-common/src/services/base-application-service';
import { ApplicationServiceFragment } from 'saffron-common/src/fragments/index';


@loggable
export default class KeyBindingService extends BaseApplicationService<IApplication> {
 
  public logger:Logger;
  
  initialize() {
    this.app
      .fragments
      .queryAll<any>('key-bindings/**').forEach((fragment) => {
        this._addKeyBinding(
          fragment.create({ app: this.app, bus: this.bus })
        );
      });
  }

  _addKeyBinding(keyBinding) {
    this.logger.verbose('add key %s', keyBinding.key);
    Mousetrap.bind(keyBinding.key, (event) => {
      this.logger.verbose('handle key %s', keyBinding.key);
      keyBinding.execute({
        key: keyBinding.key
      });
      event.preventDefault();
    });
  }
}

export const fragment = new ApplicationServiceFragment('application/services/key-binding', KeyBindingService);
