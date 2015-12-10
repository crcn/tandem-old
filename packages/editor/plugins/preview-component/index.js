import { PreviewComponentEntry } from 'editor/entries';
import PreviewComponent from './preview';
import PreviewState from './preview-state';


export default {
  create({ app }) {

    app.previewState = PreviewState.create({
      canvasWidth: 500,
      canvasHeight: 400,
      notifier: app.notifier
    });

    app.registry.push(PreviewComponentEntry.create({
      id: 'basicPreview',
      componentClass: PreviewComponent
    }));
  }
}
