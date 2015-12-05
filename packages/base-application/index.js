import BaseObject from 'base-object';
import { Registry } from 'registry';

class BaseApplication extends BaseObject {
  static plugins = [];

  constructor(properties) {
    super(properties);
    this.plugins = [];
    this.registry = Registry.create();
    this.usePlugin(...this.constructor.plugins);
  }

  /**
   * registers a new plugin
   */

  usePlugin(...plugins) {
    for (var plugin of plugins) {
      this.plugins.push(plugin.create({
        application: this
      }));
    }
  }
}

export default BaseApplication;
