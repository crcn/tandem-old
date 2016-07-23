class EventWatcherBus {
  public bus:any;
  public _watchers:any;
  
  constructor(bus) {
    this.bus = bus;
    this._watchers = {};
  }

  execute(event) {
    let watchers;
    if ((watchers = this._watchers[event.type])) {
      for (let i = watchers.length; i--;) {
        const watcher = watchers[i];
        if (watcher.target === event.target || true) {
          watcher.listener(event);
        }
      }
    }

    return this.bus.execute(event);
  }

  addListener(target, eventType, listener) {
    var watchers = this._watchers[eventType] || (this._watchers[eventType] = []);
    watchers.push({
      target: target,
      listener: listener
    });
  }

  removeListener(target, eventType, listener) {
    var watchers;
    if (!(watchers = this._watchers[eventType])) return;

    for (let i = watchers.length; i--;) {
      const watcher = watchers[i];
      if (watcher.target === target && watcher.listener === listener) {
        watchers.splice(i, 1);
        break;
      }
    }

    if (!watchers.length) {
      this._watchers[eventType] = void 0;
    }
  }
}

export function watchEvent(target, eventType, listener) {
  getEventWatcher(target).addListener(target, eventType, listener);
}

export function unwatchEvent(target, eventType, listener) {
  return getEventWatcher(target).removeListener(target, eventType, listener);
}

function getEventWatcher(target) {
  return target.bus.__eventWatcher || (target.bus.__eventWatcher = target.bus = new EventWatcherBus(target.bus));
}
