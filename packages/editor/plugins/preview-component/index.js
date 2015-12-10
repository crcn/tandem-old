import { PreviewComponentEntry, ComponentEntry, Entry } from 'editor/entries';
import PreviewComponent from './preview';
import Preview from './models/preview';
import TextTool from './tools/text-tool';
import PointerTool from './tools/pointer-tool';
import React from 'react';

export default {
  create({ app }) {

    var preview = app.preview = Preview.create({
      canvasWidth  : 500,
      canvasHeight : 400,
      zoom         : 0,
      notifier     : app.notifier
    });

    app.registry.push(PreviewComponentEntry.create({
      id: 'basicPreview',
      componentClass: PreviewComponent
    }));

    var textTool    = TextTool.create({ app });
    var pointerTool = PointerTool.create({ app });

    app.registry.push(Entry.create({
      icon    : 'cursor',
      id      : 'pointerTool',
      type    : 'previewTool',
      tool    : pointerTool
    }));

    app.registry.push(Entry.create({
      icon    : 'text',
      id      : 'textTool',
      type    : 'previewTool',
      tool    : textTool
    }));

    app.registry.push(Entry.create({
      id         : 'textToolKeyCommand',
      type       : 'keyCommand',
      keyCommand : 't',
      handler    : preview.setTool.bind(preview, textTool)
    }));

    app.registry.push(Entry.create({
      id         : 'pointerToolKeyCommand',
      type       : 'keyCommand',
      keyCommand : 'p',
      handler    : preview.setTool.bind(preview, pointerTool)
    }));

    app.registry.push(Entry.create({
      id         : 'zoomInKeyCommand',
      type       : 'keyCommand',
      keyCommand : 'ctrl+]',
      handler    : preview.zoomIn.bind(preview)
    }));

    app.registry.push(Entry.create({
      id         : 'zoomOutKeyCommand',
      type       : 'keyCommand',
      keyCommand : 'ctrl+[',
      handler    : preview.zoomOut.bind(preview)
    }));

    preview.setTool(pointerTool);

    // TODO - register layer styles too
    registerComponents(app);
  }
}

function registerComponents(app) {

  [
    'ul',
    'li',
    'div',
    'button',
    'br',
    'center',
    'footer',
    'code',
    'col',
    'iframe',
    'html',
    'body',
    'head',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'a',
    'input',
    'title',
    'strong',
    'style',
    'p',
    'ol',
    'link',
    'i',
    'b',
    'text'
  ].forEach(function(elementName) {
    app.registry.push(ComponentEntry.create({
      id: elementName + 'Element',
      componentType: elementName,
      factory: {
        create(props, children) {
          var node = props.node;
          var type = node.type === 'text' ? 'span' : node.type;
          return React.createElement('span', {
            'data-node-id': node.id,
            ...node.attributes
          }, children.length ? children : props.node.value);
        }
      }
    }));
  });

}
