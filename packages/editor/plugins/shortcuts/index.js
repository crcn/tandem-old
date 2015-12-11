import { TypeNotifier, CallbackNotifier } from 'common/notifiers';
import { INITIALIZE } from 'base/messages';
import mousetrap from 'mousetrap';
import sift from 'sift';

export default {
  type: 'application',
  create({ app }) {

    // TODO - rebind when registry changes
    app.notifier.push(TypeNotifier.create(INITIALIZE, CallbackNotifier.create(registerKeyBindings)));

    function registerKeyBindings() {
      app.plugins.filter(sift({
        type: 'keyCommand'
      })).forEach(registerKeyBinding);
    }

    function registerKeyBinding(entry) {
      mousetrap.bind(entry.keyCommand, entry.handler);
    }
  }
};
