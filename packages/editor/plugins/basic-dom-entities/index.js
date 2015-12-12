import { ApplicationPlugin, EntityPlugin, EntityPaneComponentPlugin, EntityLayerLabelComponentPlugin } from 'editor/plugin-types';

import { TextEntity } from './entities';
import TextEntityPaneComponent from './components/entity-panes/text';
import TextLayerLabelComponent from './components/entity-layer-labels/text';

export default ApplicationPlugin.create({
  id: 'basicDOMEntities',
  factory: {
    create({ app }) {
      app.plugins.push(

        // text
        EntityPlugin.create({
          id      : 'textEntity',
          factory : TextEntity
        }),
        EntityPaneComponentPlugin.create({
          id             : 'textPaneComponent',
          paneType       : 'text',
          componentClass : TextEntityPaneComponent
        }),
        EntityLayerLabelComponentPlugin.create({
          id             : 'textPaneLayerComponent',
          layerType      : 'text',
          componentClass : TextLayerLabelComponent
        })
      );
    }
  }
});
