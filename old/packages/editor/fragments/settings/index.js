import store from 'store';
import debounce from 'lodash/function/debounce';
import ObservableObject from 'saffron-common/object/observable';
import { CallbackNotifier } from 'saffron-common/notifiers';
import { ApplicationFragment } from 'editor/fragment/types';

/**
 * basic editor config settings such as sidebar widths, panes open
 * and other states.
 *
 * TODO: flesh this bugger out -- this is hardly done.
 */

export default ApplicationFragment.create({
  id: 'applicationSettings',
  factory: {
    create({ app }) {

      var save = debounce(function() {
        var s = JSON.parse(JSON.stringify(app.settings));
        store.set('settings', s);
      }, 250);

      app.settings = ObservableObject.create({
        ...store.get('settings'),
        notifier: CallbackNotifier.create(function(message) {
          // store settings
          save();
          return app.notifier.notify(message);
        })
      });
    }
  }
});
