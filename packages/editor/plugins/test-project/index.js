import { ApplicationPlugin } from 'editor/plugin/types';
import { Entity } from 'editor/entity-types';
import { TypeNotifier, CallbackNotifier } from 'common/notifiers';
import { LOAD } from 'base/messages';

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

        app.setProperties({
          rootEntity: entity
        });
      }

    }
  }
});
