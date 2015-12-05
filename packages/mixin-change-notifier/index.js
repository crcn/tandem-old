import { ChangeMessage } from 'messages';

export default function(clazz) {

  class ctor extends clazz {
    setProperties(properties) {
      var notifier = this.notifier;
      super.setProperties(properties);
      if (notifier) this.notifier.notify(ChangeMessage.create(this));
    }
  }

  return ctor;
};
