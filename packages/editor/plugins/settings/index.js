import store from 'store';
import debounce from 'lodash/function/debounce';
import ObservableObject from 'common/object/observable';
import { CallbackNotifier } from 'common/notifiers';
import { ApplicationPlugin } from 'editor/plugin/types';

export default ApplicationPlugin.create({
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
