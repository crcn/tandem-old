import { ApplicationPlugin, EntityPlugin, EntityPaneComponentPlugin } from 'editor/plugin-types';

import { TextEntity } from './entities';
import TextEntityPaneComponent from './components/entity-panes/text';

export default ApplicationPlugin.create({
  id: 'basicDOMEntities',
  factory: {
    create({ app }) {
      app.registry.push(

        // text
        EntityPlugin.create({
          id      : 'textEntity',
          factory : TextEntity
        }),
        EntityPaneComponentPlugin.create({
          id             : 'textPaneComponent',
          paneType       : 'text',
          componentClass : TextEntityPaneComponent
        })
      );
    }
  }
});
