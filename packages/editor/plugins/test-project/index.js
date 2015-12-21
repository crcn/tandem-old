import { ApplicationPlugin } from 'editor/plugin/types';
import { Entity } from 'editor/entities';
import { TypeNotifier, CallbackNotifier } from 'common/notifiers';
import { LOAD } from 'base/message-types';
import { LOAD_ROOT_ENTITY, RootEntityMessage } from 'editor/message-types';

export default ApplicationPlugin.create({
  id: 'testProject',
  factory: {
    create({ app }) {

      app.notifier.push(TypeNotifier.create(LOAD, CallbackNotifier.create(load)));

      function load() {

        var root = app.plugins.queryOne({
          id: 'rootEntity'
        });

        var div = app.plugins.queryOne({
          id: 'elementEntity'
        });


        var entity = root.factory.create({
          notifier : app.notifier,
          canvasWidth: 1024,
          canvasHeight: 768
        });

        entity.children.push(div.factory.create({
          notifier      : app.notifier,
          componentType : 'div',
          label         : 'div', // don't want,
          icon          : 'puzzle'
        }));

        app.notifier.notify(RootEntityMessage.create(LOAD_ROOT_ENTITY, entity));
      }

    }
  }
});
