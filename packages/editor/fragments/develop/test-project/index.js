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
    }, [
      div.factory.create({
        componentType: 'div',
        label        : 'div2',
        attributes : {
          style: {
            position: 'relative',
            margin: '10px',
            //left: '100px',
            //top: '100px',
            width: '100px',
            height: '100px',
            background: '#F60'
          }
        }
      }),
      div.factory.create({
        componentType: 'div',
        label        : 'div2',
        attributes : {
          style: {
            position: 'relative',
            padding: '10px',
            left: '500px',
            top: '150px',
            width: '100px',
            height: '100px',
            background: 'linear-gradient(90deg, blue, black)'
          }
        }
      })
    ]);

    app.notifier.notify(RootEntityMessage.create(SET_ROOT_ENTITY, entity));
  }
  return [];
}