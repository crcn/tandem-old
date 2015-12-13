import {
  ApplicationPlugin,
  EntityPlugin,
  EntityPaneComponentPlugin,
  EntityLayerLabelComponentPlugin,
  Plugin,
  KeyCommandPlugin
} from 'editor/plugin/types';

import { TextEntity, ElementEntity } from './entities';
import TransformPaneComponent from './components/entity-panes/transform';
import TypographyPaneComponent from './components/entity-panes/typography';
import TextLayerLabelComponent from './components/entity-layer-labels/text';

export default ApplicationPlugin.create({
  id: 'basicDOMEntities',
  factory: {
    create({ app }) {
      registerEntities(app);
      registerCommands(app);
    }
  }
});


function registerEntities(app) {
  app.plugins.push(

    // text
    EntityPlugin.create({
      id      : 'textEntity',
      factory : TextEntity
    }),
    EntityPaneComponentPlugin.create({
      id             : 'transformPaneComponent',
      label          : 'Transform',
      paneType       : 'entity',
      componentClass : TransformPaneComponent
    }),
    EntityPaneComponentPlugin.create({
      id             : 'typographyPaneComponent',
      label          : 'Typogarphy',
      paneType       : 'entity',
      componentClass : TypographyPaneComponent
    }),
    EntityLayerLabelComponentPlugin.create({
      id             : 'textPaneLayerComponent',
      layerType      : 'text',
      componentClass : TextLayerLabelComponent
    }),

    // element
    EntityPlugin.create({
      id      : 'elementEntity',
      factory : ElementEntity
    })
  );
}

function registerCommands(app) {
  app.plugins.push(

    // generic
    // TODO - move this elsewhere
    KeyCommandPlugin.create({
      id         : 'boldCommand',

      // TODO - remove control once moved to desktop app
      keyCommand : 'backspace',
      handler    : function() {
        if (!app.focus || !app.focus.componentType || !app.focus.parent) return;

        // FIXME: leaky here. should be able to remove entity
        // without it being unfocused
        var focus = app.focus;
        app.setFocus(void 0);
        focus.parent.children.remove(focus);
      }
    }),


    // text
    KeyCommandPlugin.create({
      id         : 'boldCommand',
      keyCommand : 'command+b',
      handler    : createStyleToggler(app, 'fontWeight', 'bold', 'normal')
    }),
    KeyCommandPlugin.create({
      id         : 'italicCommand',
      keyCommand : 'command+i',
      handler    : createStyleToggler(app, 'fontStyle', 'italic', 'normal')
    }),
    KeyCommandPlugin.create({
      id         : 'underlineCommand',
      keyCommand : 'command+u',
      handler    : createStyleToggler(app, 'textDecoration', 'underline', 'none')
    })
  );
}

function createStyleToggler(app, name, onValue, offValue) {
  return function(message) {
    if (!app.focus || app.focus.componentType !== 'text') return;
    app.focus.setStyle({
      [name]: app.focus.getStyle()[name] === onValue ? offValue : onValue
    });
  }
}
