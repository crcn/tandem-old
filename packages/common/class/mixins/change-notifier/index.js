import { ChangeMessage } from 'base/messages';

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

      // TODO - add new & old props
      if (changes.length && notifier) notifier.notify(ChangeMessage.create(changes));
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
