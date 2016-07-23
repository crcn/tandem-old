class PropertyWatcherBus {
  public bus:any;
  public _watchers:any;

  constructor(bus) {
    this.bus = bus;
    this._watchers = {};
  }

  execute(event) {
    if (event.type === 'change') {
      return this.executeChange(event);
    }
    return this.bus.execute(event);
  }

  executeChange(event) {
    for (const change of event.changes) {
      const watchers = this._watchers[change.property];
      if (!watchers) continue;
      for (const watcher of watchers) {
        if (watcher.target === change.target) {
          watcher.trigger();
        }
      }
    }
  }

  watchProperty(target, property, listener):any {

    if (~property.indexOf('.')) {
      return this._watchNestedProperty(target, property, listener);
    }

    return this._watchSimpleProperty(target, property, listener);
  }

  _watchNestedProperty(target, path, listener) {
    var segments = path.split('.');

    var onChange = () => {
      reset();
    };

    var reset = () => {
      var currentTarget = target;
      var watcher;
      for (const segment of segments) {
        watcher = this._watchSimpleProperty(currentTarget, segment, onChange);
        currentTarget = watcher.currentValue;
        if (!currentTarget) return void 0;
      }
      return watcher;
    };

    reset();
  }

  _watchSimpleProperty(target, property, listener) {
    var watchers;
    if (!(watchers = this._watchers[property])) {
      watchers = this._watchers[property] = [];
    }

    const watcher = {
      target: target,
      currentValue: target[property],
      dispose() {
        this.dispose = function () { };
        watchers.splice(watchers.indexOf(this), 1);
      },
      trigger() {
        var oldValue = this.currentValue;
        listener(this.currentValue = target[property], oldValue);
      },
    };

    watchers.push(watcher);

    return watcher;
  }
}

export default function watchProperty(target, property, listener) {
  if (!target.bus) throw new Error('the target must have a "bus" property');
  const propertyWatcher = target.bus.__propertyWatcher || (target.bus.__propertyWatcher = target.bus = new PropertyWatcherBus(target.bus));
  return propertyWatcher.watchProperty(target, property, listener);
}
