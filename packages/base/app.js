import ObservableObject from 'common/object/observable';
import { Registry } from 'common/registry';
import { NotifierCollection } from 'common/notifiers';
import { InitializeMessage, LoadMessage } from 'base/messages';

class BaseApplication extends ObservableObject {

  static plugins = [];
  static entries = [];

  constructor(properties) {
    super(properties);

    // app extensions
    this.plugins = [];

    // class registry such as components classes, tools, models
    this.registry = Registry.create(void 0, this.constructor.entries);

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
    await this.notifier.notify(LoadMessage.create()).then(this.didLoad.bind(this));

    // then initialize
    await this.notifier.notify(InitializeMessage.create()).then(this.didInitialize.bind(this));
  }

  /**
   */

  didLoad() {

  }

  /**
   */

  didInitialize() {

  }
}

export default BaseApplication;
