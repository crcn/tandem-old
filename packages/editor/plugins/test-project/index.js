import { ApplicationPlugin } from 'editor/plugin/types';
import { Entity } from 'editor/entity-types';
import { TypeNotifier, CallbackNotifier } from 'common/notifiers';
import { LOAD } from 'base/message-types';
import { LOAD_ROOT_ENTITY, RootEntityMessage } from 'editor/message-types';

export default ApplicationPlugin.create({
  id: 'testProject',
  factory: {
    create({ app }) {

      app.notifier.push(TypeNotifier.create(LOAD, CallbackNotifier.create(load)));

      function load() {

        var div = app.plugins.queryOne({
          id: 'elementEntity'
        });

        var entity = div.factory.create({
          notifier      : app.notifier,
          componentType : 'div',
          label         : 'div', // don't want,
          icon          : 'puzzle'
        });

        app.notifier.notify(RootEntityMessage.create(LOAD_ROOT_ENTITY, entity));
      }

    }
  }
});
