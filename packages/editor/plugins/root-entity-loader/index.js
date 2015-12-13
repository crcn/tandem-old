import { ApplicationPlugin } from 'editor/plugin/types';
import { TypeNotifier, CallbackNotifier } from 'common/notifiers';

import {
  SET_ROOT_ENTITY,
  LOAD_ROOT_ENTITY,
  RootEntityMessage
} from 'editor/message-types';


export default ApplicationPlugin.create({
  id: 'root-entity-loader',
  factory: {
    create({ app }) {
      app.notifier.push(TypeNotifier.create(LOAD_ROOT_ENTITY, load));

      function load(message) {

        // TODO - change this to app.setRootEntry()
        app.setProperties({
          rootEntity: message.entity
        });

        app.notifier.notify(RootEntityMessage.create(SET_ROOT_ENTITY, message.entity));
      }
    }
  }
});
