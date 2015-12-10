import { PreviewComponentEntry, ComponentEntry, Entry } from 'editor/entries';
import PreviewComponent from './preview';
import Preview from './models/preview';
import TextTool from './models/text-tool';
import PointerTool from './models/pointer-tool';
import React from 'react';

export default {
  create({ app }) {

    var preview = app.preview = Preview.create({
      canvasWidth  : 500,
      canvasHeight : 400,
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
      icon       : 'text',
      id         : 'textToolKeyCommand',
      type       : 'keyCommand',
      keyCommand : 't',
      handler    : preview.setTool.bind(preview, textTool)
    }));

    app.registry.push(Entry.create({
      icon       : 'text',
      id         : 'pointerToolKeyCommand',
      type       : 'keyCommand',
      keyCommand : 'p',
      handler    : preview.setTool.bind(preview, pointerTool)
    }));

    preview.setTool(textTool);

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
    'b'
  ].forEach(function(elementName) {
    app.registry.push(ComponentEntry.create({
      id: elementName + 'Element',
      componentType: elementName,
      componentClass: elementName
    }));
  });

  app.registry.push(Entry.create({
    id: 'textElement',
    type: 'component',
    componentType: 'text',
    factory: {
      create(props, children) {
        return React.createElement('span', props.node.attributes, props.node.value);
      }
    }
  }));

}
