import loggable from 'saffron-common/lib/decorators/loggable';

import BaseApplicationService from 'saffron-common/lib/services/base-application-service';
import { ClassFactoryFragment } from 'saffron-common/lib/fragments/index';
import * as Mousetrap from 'mousetrap';

@loggable
export default class KeyBindingService extends BaseApplicationService {
 
  public logger:any;
  
  initialize() {
    this.app
      .fragments
      .queryAll('key-bindings/**').forEach((fragment) => {
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

export const fragment = new ClassFactoryFragment('application/services/key-binding', KeyBindingService);
