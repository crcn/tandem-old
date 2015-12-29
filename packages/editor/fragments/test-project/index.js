import { ApplicationFragment } from 'editor/fragment/types';
import { Entity } from 'editor/entities';
import { TypeNotifier, CallbackNotifier } from 'common/notifiers';
import { LOAD } from 'base/message-types';
import { LOAD_ROOT_ENTITY, RootEntityMessage } from 'editor/message-types';

export default ApplicationFragment.create({
  id: 'testProject',
  factory: {
    create({ app }) {

      app.notifier.push(TypeNotifier.create(LOAD, CallbackNotifier.create(load)));

      function load() {

        var div = app.fragments.queryOne({
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
