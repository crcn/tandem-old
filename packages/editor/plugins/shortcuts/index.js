
import mousetrap from 'mousetrap';
import { INITIALIZE } from 'base/message-types';
import { ApplicationPlugin } from 'editor/plugin/types';
import { ALL_KEY_COMMANDS } from 'editor/plugin/queries';
import { TypeNotifier, CallbackNotifier } from 'common/notifiers';

export default ApplicationPlugin.create({
  id: 'shortcuts',
  factory: {
    create({ app }) {

      // TODO - rebind when registry changes
      // TODO - ability to notify multiple handlers bound to same
      // key
      app.notifier.push(TypeNotifier.create(INITIALIZE, CallbackNotifier.create(registerKeyBindings)));

      function registerKeyBindings() {
        app.plugins.query(ALL_KEY_COMMANDS).forEach(registerKeyBinding);
      }

      function registerKeyBinding(plugin) {
        mousetrap.bind(plugin.keyCommand, function(event) {

          // do NOT hijack key code events unless there is a modifier (ctrl mainly)
          if (/input|textarea/i.test(event.target.nodeName) && !(event.metaKey || event.ctrlKey)) {
            return;
          }

          event.preventDefault();
          plugin.handler();
        });
      }
    }
  }
});
