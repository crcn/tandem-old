import { PreviewComponentPlugin, ComponentPlugin, Plugin } from 'editor/plugin-types';
import PreviewComponent from './preview';
import Preview from './models/preview';
import TextTool from './tools/text-tool';
import PointerTool from './tools/pointer-tool';
import TextPaneComponent from './text-pane';
import React from 'react';
import HTMLNode from './html-node';

export default {
  type: 'application',
  create({ app }) {

    var preview = app.preview = Preview.create({
      canvasWidth  : 500,
      canvasHeight : 400,
      zoom         : 0,
      notifier     : app.notifier
    });

    app.plugins.push(PreviewComponentPlugin.create({
      id: 'basicPreview',
      componentClass: PreviewComponent
    }));

    var textTool    = TextTool.create({ app });
    var pointerTool = PointerTool.create({ app });

    app.plugins.push(Plugin.create({
      icon    : 'cursor',
      id      : 'pointerTool',
      type    : 'previewTool',
      tool    : pointerTool
    }));

    app.plugins.push(Plugin.create({
      icon    : 'text',
      id      : 'textTool',
      type    : 'previewTool',
      tool    : textTool
    }));

    app.plugins.push(Plugin.create({
      id         : 'textToolKeyCommand',
      type       : 'keyCommand',
      keyCommand : 't',
      handler    : preview.setTool.bind(preview, textTool)
    }));

    app.plugins.push(Plugin.create({
      id         : 'pointerToolKeyCommand',
      type       : 'keyCommand',
      keyCommand : 'p',
      handler    : preview.setTool.bind(preview, pointerTool)
    }));

    app.plugins.push(ComponentPlugin.create({
      id: 'textPaneComponent',
      paneType: 'text',
      componentClass: TextPaneComponent
    }));

    app.plugins.push(Plugin.create({
      id         : 'zoomInKeyCommand',
      type       : 'keyCommand',
      keyCommand : 'ctrl+]',
      handler    : preview.zoomIn.bind(preview)
    }));

    app.plugins.push(Plugin.create({
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
    app.plugins.push(ComponentPlugin.create({
      id: elementName + 'Element',
      componentType: elementName,
      componentClass: HTMLNode
    }));
  });

}
