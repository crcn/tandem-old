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
      componentType : 'element',
      tagName       : 'div',
      layerExpanded : true
    }, [
      div.factory.create({
        componentType: 'element',
        tagName      : 'div',
        attributes : {
          id: 'box2',
          style: {
            position: 'relative',
            padding: '10px',
            left: '200px',
            top: '200px',
            width: '100px',
            height: '100px',
            background: 'linear-gradient(90deg, blue, black)'
          }
        }
      }, [
        div.factory.create({
          componentType: 'element',
          tagName      : 'div',
          attributes : {
            id: 'box1',
            class: 'abcd efg',
            style: {
              position: 'absolute',
              //margin: '10px',
              //left: '100px',
              //top: '100px',
              width: '100px',
              height: '100px',
              background: '#F60'
            }
          }
        })
      ]),
      div.factory.create({
        componentType: 'element',
        tagName      : 'div',
        attributes : {
          id: 'box1',
          class: 'abcd efg',
          style: {
            position: 'absolute',
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
        componentType: 'element',
        tagName      : 'div',
        attributes : {
          id: 'box1',
          class: 'abcd efg',
          style: {
            position: 'absolute',
            margin: '20px',
            left: '300px',
            //top: '100px',
            width: '100px',
            height: '100px',
            background: '#F60'
          }
        }
      })
    ]);

    entity.notifier.push(app.notifier);

    app.notifier.notify(RootEntityMessage.create(SET_ROOT_ENTITY, entity));
  }
  return [];
}
