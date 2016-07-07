import CoreObject from '../index';
import CoreCollection from '../collection';
import { ChangeEvent } from 'common/events';

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

function decorateObjectClass(clazz) {

  var oldSetProperties = clazz.prototype.setProperties;

  clazz.prototype.setProperties = function(properties) {

    if (this.bus) {
      var changes = [];
      for (var key in properties) {
        var newValue = properties[key];
        var oldValue = this[key];

        // no change? skip.
        if (newValue == oldValue) continue;

        if (newValue == void 0) {
          changes.push({
            target: this,
            type: 'delete',
            property: key,
            oldValue: oldValue
          });
        } else if (newValue != void 0) {
          if (oldValue == void 0) {
            changes.push({
              target: this,
              type: 'create',
              property: key,
              value: newValue
            });
          } else {
            changes.push({
              target: this,
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
      this.bus.execute(ChangeEvent.create(changes));
    }
  }

  return clazz;
}

function decorateCollectionClass(clazz) {

  decorateObjectClass(clazz);

  var oldSplice = clazz.prototype.splice;
  clazz.prototype.splice = function(start, length, ...repl) {

    if (this.bus) {
      var changes = [];
      changes.push({
        target: this,
        type   : 'splice',
        start  : start,
        length : length,
        values : repl
      });

      this.bus.execute(ChangeEvent.create(changes));
    }

    var ret = oldSplice.apply(this, arguments);

    return ret;
  }

  return clazz;
}
