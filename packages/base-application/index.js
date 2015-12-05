import BaseObject from 'base-object';
import { Registry } from 'registry';
import { NotifierCollection } from 'notifiers';
import { InitializeMessage } from 'notifier-messages';
import mixinChangeNotifier from 'mixin-change-notifier';

class BaseApplication extends BaseObject {

  static plugins = [];

  constructor(properties) {
    super(properties);

    // application extensions
    this.plugins = [];

    //
    this.registry = Registry.create();

    // central communication object
    this.notifier = NotifierCollection.create();

    // load in initial plugins immediately
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

  /**
   * initializes the application
   */

  initialize(config) {
    this.config = config;
    this.notifier.notify(InitializeMessage.create());
  }
}

BaseApplication = mixinChangeNotifier(BaseApplication);

export default BaseApplication;
