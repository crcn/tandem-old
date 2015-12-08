import { AppPaneComponentEntry } from 'editor/entries';
import LayersPaneComponent from './layers';

export default {
  create({ app }) {
    app.registry.push(AppPaneComponentEntry.create({
      id             : 'layersPane',
      label          : 'Layers',
      componentClass : LayersPaneComponent
    }));
  }
}
