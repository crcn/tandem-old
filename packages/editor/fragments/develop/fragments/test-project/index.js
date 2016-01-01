import { TypeNotifier, CallbackNotifier } from 'common/notifiers';
import { LOAD } from 'base/message-types';
import { SET_ROOT_ENTITY, RootEntityMessage } from 'editor/message-types';

export function create({ app }) {
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

    app.notifier.notify(RootEntityMessage.create(SET_ROOT_ENTITY, entity));
  }
  return [];
}