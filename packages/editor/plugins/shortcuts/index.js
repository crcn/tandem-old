import { TypeNotifier, CallbackNotifier } from 'common/notifiers';
import { ApplicationPlugin } from 'editor/plugin/types';
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
        app.plugins.filter(sift({
          type: 'keyCommand'
        })).forEach(registerKeyBinding);
      }

      function registerKeyBinding(plugin) {
        mousetrap.bind(plugin.keyCommand, plugin.handler);
      }
    }
  }
});
