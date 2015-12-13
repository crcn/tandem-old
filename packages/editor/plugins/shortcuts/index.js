import { TypeNotifier, CallbackNotifier } from 'common/notifiers';
import { ApplicationPlugin } from 'editor/plugin/types';
import { ALL_KEY_COMMANDS } from 'editor/plugin/queries';
import { INITIALIZE } from 'base/messages';
import mousetrap from 'mousetrap';
import sift from 'sift';

export default ApplicationPlugin.create({
  id: 'shortcuts',
  factory: {
    create({ app }) {

      // TODO - rebind when registry changes
      app.notifier.push(TypeNotifier.create(INITIALIZE, CallbackNotifier.create(registerKeyBindings)));

      function registerKeyBindings() {
        app.plugins.query(ALL_KEY_COMMANDS).forEach(registerKeyBinding);
      }

      function registerKeyBinding(plugin) {
        mousetrap.bind(plugin.keyCommand, plugin.handler);
      }
    }
  }
});
