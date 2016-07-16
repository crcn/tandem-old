import loggable from 'common/logger/mixins/loggable';

import { Service } from 'common/services';
import { FactoryFragment } from 'common/fragments';
import Mousetrap from 'mousetrap';

@loggable
export default class KeyBindingService extends Service {
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

export const fragment = FactoryFragment.create({
  ns      : 'application/services/key-binding',
  factory : KeyBindingService
});