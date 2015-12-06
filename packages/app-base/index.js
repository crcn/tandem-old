import ObservableObject from 'object-observable';
import { Registry } from 'registry';
import { NotifierCollection } from 'notifiers';
import { InitializeMessage, LoadMessage } from 'notifier-messages';

class BaseApplication extends ObservableObject {

  static plugins = [];

  constructor(properties) {
    super(properties);

    // app extensions
    this.plugins = [];

    // class registry such as components classes, tools, models
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
        app: this
      }));
    }
  }

  /**
   * initializes the app
   */

  async initialize(config) {

    this.config = config;

    // first load the app
    await this.notifier.notify(LoadMessage.create());

    // then initialize
    await this.notifier.notify(InitializeMessage.create());
  }
}

export default BaseApplication;
