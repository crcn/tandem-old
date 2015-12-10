import { PreviewComponentEntry, Entry } from 'editor/entries';
import PreviewComponent from './preview';
import Preview from './models/preview';
import TextTool from './models/text-tool';
import PointerTool from './models/pointer-tool';

export default {
  create({ app }) {

    var preview = app.preview = Preview.create({
      canvasWidth  : 500,
      canvasHeight : 400,
      notifier     : app.notifier
    });

    preview.setTool(TextTool.create({
      notifier: app.notifier
    }));

    app.registry.push(PreviewComponentEntry.create({
      id: 'basicPreview',
      componentClass: PreviewComponent
    }));

    /*
      <li className='s s-cursor'></li>
      <li className='s s-puzzle'></li>
      <li className='s s-shapes'></li>
    */

    var textTool    = TextTool.create();
    var pointerTool = PointerTool.create();

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
  }
}
