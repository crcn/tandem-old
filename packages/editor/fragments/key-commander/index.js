import mousetrap from 'mousetrap';
import { INITIALIZE } from 'base/message-types';
import { ApplicationFragment } from 'editor/fragment/types';
import { ALL_KEY_COMMANDS } from 'editor/fragment/queries';
import { TypeNotifier, CallbackNotifier } from 'common/notifiers';

export default ApplicationFragment.create({
  id: 'shortcuts',
  factory: {
    create({ app }) {

      // TODO - rebind when registry changes
      // TODO - ability to notify multiple handlers bound to same
      // key
      app.notifier.push(TypeNotifier.create(INITIALIZE, CallbackNotifier.create(registerKeyBindings)));

      function registerKeyBindings() {
        app.fragments.query(ALL_KEY_COMMANDS).forEach(registerKeyBinding);
      }

      function registerKeyBinding(fragment) {
        mousetrap.bind(fragment.keyCommand, function(event) {

          // do NOT hijack key code events unless there is a modifier (ctrl mainly)
          if (event.target.dataset['mouseTrap'] === 'false') {
            return;
          }

          if (/input|textarea/i.test(event.target.nodeName) && !(event.metaKey || event.ctrlKey || event.delKey)) {
            return;
          }

          event.preventDefault();
          fragment.notifier.notify(event);
        });
      }
    }
  }
});
