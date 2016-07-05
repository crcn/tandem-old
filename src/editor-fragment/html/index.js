import { ApplicationFragment } from 'common/application/fragments';
import { fragment as previewComponentFragment } from './components/preview';
import DOMElementEntity from './entities/dom-element';
import DOMTextEntity from './entities/dom-text';
import TypeDispatcher from 'common/dispatchers/type';
import compileXMLtoJS from 'paperclip/xml/compile';
import { diff, patch } from 'common/utils/node/diff';

export default ApplicationFragment.create(
  'html',
  create
);

function create(app) {
  app.fragmentDictionary.register(
    previewComponentFragment
  );

  app.rootEntity = DOMElementEntity.create({
    name: 'div',
    style: {
      backgroundColor: 'red',
      width: '100px',
      height: '100px'
    },
    attributes: {
      'class': 'blarg'
    }
  });


  app.bus.observe(TypeDispatcher.create('setSource', {
    dispatch(event) {
      var newEntity = compileXMLtoJS(event.source)(function(type) {
        switch(type) {
          case 'element': return new DOMElementEntity({
            name: arguments[1],
            attributes: arguments[2],
            childNodes: arguments[3]
          });

          case 'text': return new DOMTextEntity({
            nodeValue: arguments[1]
          });
        }
      });

      // TODO - need to patch this
      app.setProperties({
        rootEntity: newEntity
      });
    }
  }))
}
