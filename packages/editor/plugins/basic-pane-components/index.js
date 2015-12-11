import { AppPaneComponentPlugin, SymbolPaneComponentPlugin } from 'editor/plugin-types';
import LayersPaneComponent from './layers';
import PropertiesPaneComponent from './properties';


export default {
  type: 'application',
  create({ app }) {
    app.plugins.push(AppPaneComponentPlugin.create({
      id             : 'layersPane',
      label          : 'Layers',
      componentClass : LayersPaneComponent
    }));

    app.plugins.push(SymbolPaneComponentPlugin.create({
      id             : 'propertiesPane',
      label          : 'Properties',
      componentClass : PropertiesPaneComponent
    }));
  }
}
