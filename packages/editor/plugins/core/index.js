import RootComponent from './components/root';
import LayersPaneComponent from './components/layer-pane';

import {
  ApplicationPlugin,
  ComponentPlugin,
  AppPaneComponentPlugin
} from 'editor/plugin/types';

export default ApplicationPlugin.create({
  id: 'coreAppPlugin',
  factory: {
    create({ app }) {
      app.plugins.push(

        ComponentPlugin.create({
          id: 'rootComponent',
          componentClass: RootComponent
        }),

        // basic panes
        AppPaneComponentPlugin.create({
          id             : 'layersPane',
          label          : 'Layers',
          componentClass : LayersPaneComponent
        })
      )
    }
  }
});
