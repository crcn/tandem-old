import { ApplicationFragment } from 'common/application/fragments';

import * as fragments from './fragments';

import DOMElementEntity from './entities/dom-element';
import DOMFrameEntitiy from './entities/dom-frame';
import DOMTextEntity from './entities/dom-text';
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

  app.rootEntity = DOMFrameEntitiy.create({
    bus: app.bus,
    style: {
      left: '100px',
      top : '100px',
      width: '700px',
      height: '500px'
    },
    childNodes: [DOMElementEntity.create({
      bus: app.bus,
      name: 'div',
      style: {
        backgroundColor: 'red',
        'position': 'absolute',
        'padding': '10px',
        'width': '400px',
        left: '100px',
        top: '20px'
      },
      attributes: {
        'class': 'blarg'
      },
      childNodes: [
        DOMElementEntity.create({
          bus: app.bus,
          name: 'div',
          style: {
            backgroundColor: 'blue',
            left: '100px',
            top: '20px',
            width: '300px',
            height: '100px'
          }
        })
      ]
    })]
  });


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
