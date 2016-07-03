import CoreObject from '../index';
import CoreCollection from '../collection';
import { ChangeEvent } from 'common/events';
import ObservableDispatcher from 'common/dispatchers/observable';

export default function observable(clazz) {

  var proto = clazz.prototype;

  if (proto instanceof CoreObject) {
    decorateObjectClass(clazz);
  } else if (proto instanceof CoreCollection) {
    decorateCollectionClass(clazz);
  } else {
    throw new Error(`class "${clazz.name}" cannot be made an observable. It must extend either a common Object or Collection.`);
  }

  if (clazz.__observable) {
    throw new Error(`class "${clazz.name}" is already observable.`);
  }

  clazz.__observable = true;

  return clazz;
}

function decorateCollectionClass(clazz) {

  decorateObserveMethod(clazz);

  var oldSplice = clazz.prototype.splice;
  clazz.prototype.splice = function(start, length, ...repl) {

    if (this._dispatcher) {
      var changes = [];
      changes.push({
        type   : 'splice',
        start  : start,
        length : length,
        values : repl
      });

      this._dispatcher.dispatch(ChangeEvent.create(changes));
    }

    var ret = oldSplice.apply(this, arguments);

    return ret;
  }

  return clazz;
}

function decorateObjectClass(clazz) {
  decorateObserveMethod(clazz);

  var oldSetProperties = clazz.prototype.setProperties;

  clazz.prototype.setProperties = function(properties) {

    if (this._dispatcher) {
        var changes = [];
        for (var key in properties) {
          var newValue = properties[key];
          var oldValue = this[key];

          // no change? skip.
          if (newValue == oldValue) continue;

          if (newValue == void 0) {
            changes.push({
              type: 'delete',
              property: key,
              oldValue: oldValue
            });
          } else if (newValue != void 0) {
            if (oldValue == void 0) {
              changes.push({
                type: 'create',
                property: key,
                value: newValue
              });
            } else {
              changes.push({
                type: 'update',
                property: key,
                value: newValue,
                oldValue: oldValue
              })
            }
          }
        }

    }

    oldSetProperties.call(this, properties);

    if (changes && changes.length) {
      this._dispatcher.dispatch(ChangeEvent.create(changes));
    }
  }

  return clazz;
}

function decorateObserveMethod(clazz) {

  clazz.prototype.observe = function(listener) {
    if (!this._dispatcher) {
      this._dispatcher = ObservableDispatcher.create(this);
    }

    return this._dispatcher.observe(listener);
  }
}
