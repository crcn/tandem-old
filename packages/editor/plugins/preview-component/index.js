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

    app.registry.push(Entry.create({
      icon    : 'cursor',
      id      : 'pointerTool',
      type    : 'previewTool',
      tool    : PointerTool.create()
    }));

    app.registry.push(Entry.create({
      icon    : 'text',
      id      : 'textTool',
      type    : 'previewTool',
      tool    : TextTool.create()
    }));
  }
}
