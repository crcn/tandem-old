import { ChangeMessage } from 'base/message-types';

/**
 * Mixin which makes classes that extend BaseObject and BaseCollection
 * watchable
 * @param {Class} clazz the BaseObject or BaseCollection sub class
 * @returns {Class} ctor
 */

export default function(clazz) {

  class ctor extends clazz {
    setProperties(properties) {
      var notifier = this.notifier;

      var changes = [];

      for (var key in properties) {
        var newValue = properties[key];
        var oldValue = this[key];
        if (newValue === oldValue) continue;
        changes.push({
          target   : this,
          property : key,
          newValue : newValue,
          oldValue : oldValue
        });
      }

      super.setProperties(properties);

      if (changes.length && notifier) this.notifyChange(changes);
    }

    /**
     */

    notifyChange(changes) {

      this._updateCount = (this._updateCount || 0) + 1;

      // FIXME - kind of nasty code here - breaks abstraction of change emittion
      // via setProperties. This chunk should be re-evaluated later on - okay for now.
      if (this.notifier) {
        this.notifier.notify(ChangeMessage.create(changes || [{ target: this }]));
      }
    }
  }

  // mixin for splice as well if it exists
  if (clazz.prototype.splice) {
    ctor.prototype.splice = function(start, count, ...newItems) {

      var removed = this.slice(start, start + count);
      var added   = newItems;

      clazz.prototype.splice.apply(this, arguments);
      if (this.notifier && (added.length || removed.length)) {
        this.notifier.notify(ChangeMessage.create([
          {
            target  : this,
            start   : start,
            count   : count,
            removed : removed,
            added   : added
          }
        ]));
      }
    }
  }

  return ctor;
};
