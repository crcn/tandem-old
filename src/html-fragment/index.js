import { ApplicationFragment } from 'common/application/fragments';

import * as fragments from './fragments';

import { TypeCallbackBus } from 'common/mesh';
import compileXMLtoJS from 'paperclip/xml/compile';
import { diff, patch } from 'common/utils/node/diff';

export default [
  ApplicationFragment.create(
    'html',
    create
  ),
  Object.values(fragments)
];

function create(app) {

  app.busses.push(TypeCallbackBus.create('setSource', function(event) {
    // TODO: this is temporary code
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
  }));
}
