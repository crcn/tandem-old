import {
  Plugin,
  EntityPlugin,
  ComponentPlugin,
  KeyCommandPlugin,
  ApplicationPlugin,
  EntityPaneComponentPlugin,
  EntityLayerLabelComponentPlugin
} from 'editor/plugin/types';

import FontInputComponent from './components/style-inputs/font';
import TextInputComponent from 'common/components/inputs/text';
import TextAlignInputComponent from './components/style-inputs/text-align';
import UnitInputComponent from 'common/components/inputs/unit';
import ColorPickerComponent from 'common/components/inputs/color-picker';

import StylePaneComponent from './components/entity-panes/styles';
import { CallbackNotifier } from 'common/notifiers';
import HTMLEntityComponent from './components/preview';
import TransformPaneComponent from './components/entity-panes/transform';

import TypographyPaneComponent from './components/entity-panes/typography';
import AppearancePaneComponent from './components/entity-panes/appearance';
import TextLayerLabelComponent from './components/entity-layer-labels/text';
import { TextEntity, ElementEntity, RootEntity } from './entities';

export default ApplicationPlugin.create({
  id: 'basicDOMEntities',
  factory: {
    create({ app }) {
      registerEntities(app);
      registerCommands(app);
      registerStyleInputs(app);
    }
  }
});

function registerEntities(app) {
  app.plugins.push(

    EntityPlugin.create({
      id      : 'rootEntity',
      factory : RootEntity
    }),

    // text
    EntityPlugin.create({
      id      : 'textEntity',
      factory : TextEntity
    }),
    EntityPaneComponentPlugin.create({
      id             : 'transformPaneComponent',
      label          : 'Transform',
      styleType      : 'transform',
      paneType       : 'entity',
      entityType     : 'component',
      componentClass : StylePaneComponent
    }),
    EntityPaneComponentPlugin.create({
      id             : 'typographyPaneComponent',
      label          : 'Typography',
      styleType      : 'typography',
      paneType       : 'entity',
      entityType     : 'component',
      componentClass : StylePaneComponent
    }),
    EntityPaneComponentPlugin.create({
      id             : 'appearancePaneComponent',
      label          : 'Appearance',
      styleType      : 'appearance',
      paneType       : 'entity',
      entityType     : 'component',
      componentClass : StylePaneComponent
    }),
    EntityLayerLabelComponentPlugin.create({
      id             : 'textPaneLayerComponent',
      layerType      : 'text',
      entityType     : 'component',
      componentClass : TextLayerLabelComponent
    }),

    // element
    EntityPlugin.create({
      id      : 'elementEntity',
      factory : ElementEntity
    })
  );
}

function createComponentStylePlugin(name, type, componentClass) {
  return ComponentPlugin.create({
    id             : name + 'StyleInputComponent',
    componentType  : 'styleInput',
    componentClass : componentClass,
    styleName      : name,
    styleType      : type
  })
}

function registerStyleInputs(app) {

  var styleName;

  var inf = {
    transform: [
      [ 'left'   , UnitInputComponent ],
      [ 'top'    , UnitInputComponent ],
      [ 'width'  , UnitInputComponent ],
      [ 'height' , UnitInputComponent ]
    ],
    typography: [
      [ 'fontFamily' , FontInputComponent      ],
      [ 'fontSize'   , UnitInputComponent      ],
      [ 'textAlign'  , TextAlignInputComponent ],
      [ 'color'      , ColorPickerComponent    ]
    ],
    appearance: [
      [ 'background', UnitInputComponent ]
    ]
  }

  for (var type in inf) {
    for (var [styleName, componentClass] of inf[type]) {
      app.plugins.push(createComponentStylePlugin(styleName, type, componentClass));
    }
  }

  // default style input
  app.plugins.push(
    ComponentPlugin.create({
      id             : 'styleInputCoponent',
      componentType  : 'styleInput',
      componentClass : TextInputComponent
    })
  );
}

function registerCommands(app) {
  app.plugins.push(

    // generic
    // TODO - move this to its own plugin
    KeyCommandPlugin.create({
      id         : 'boldCommand',
      keyCommand : 'backspace',
      notifier   : CallbackNotifier.create(function() {
        if (!app.focus || !app.focus.componentType || !app.focus.parent) return;

        // FIXME: leaky here. should be able to remove entity
        // without it being unfocused
        var focus = app.focus;
        var focusIndex = focus.parent.children.indexOf(focus);

        // shift to the previous or next child
        // TODO - no children? move cursor up to the parent
        app.setFocus(focusIndex ? focus.parent.children[focusIndex - 1] : focus.parent.children[focusIndex + 1]);

        // remove the child deleted
        focus.parent.children.remove(focus);
      })
    }),


    // text
    KeyCommandPlugin.create({
      id         : 'boldCommand',
      keyCommand : 'command+b',
      notifier   : createStyleToggler(app, 'fontWeight', 'bold', 'normal')
    }),
    KeyCommandPlugin.create({
      id         : 'italicCommand',
      keyCommand : 'command+i',
      notifier   : createStyleToggler(app, 'fontStyle', 'italic', 'normal')
    }),
    KeyCommandPlugin.create({
      id         : 'underlineCommand',
      keyCommand : 'command+u',
      notifier   : createStyleToggler(app, 'textDecoration', 'underline', 'none')
    })
  );

  registerComponents(app);
}

function createStyleToggler(app, name, onValue, offValue) {
  return CallbackNotifier.create(function(message) {
    if (!app.focus || app.focus.componentType !== 'text') return;
    app.focus.setStyle({
      [name]: app.focus.getStyle()[name] === onValue ? offValue : onValue
    });
  })
}


// TODO - move this to basic-dom-entities
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
      componentClass: HTMLEntityComponent
    }));
  });
}
