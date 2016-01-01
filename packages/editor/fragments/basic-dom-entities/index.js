import {
  Fragment,
  UnitFragment,
  EntityFragment,
  SelectionFragment,
  ComponentFragment,
  KeyCommandFragment,
  ApplicationFragment,
  EntityPaneComponentFragment,
  EntityLayerLabelComponentFragment
} from 'editor/fragment/types';

import inflection from 'inflection';

import ComponentSelection from './selection/component';

import { create as createKeyCommandFragments } from './fragments/editor-key-commands';
import { create as createEntityFragments } from './fragments/entities';
import { create as createPreviewRepFragments } from './fragments/editor-preview-reps';
import { create as createCSSUnitFragments } from './fragments/css-units';
import { create as createEditorLayerLabelFragments } from './fragments/editor-layer-labels';

export default ApplicationFragment.create({
  id: 'basicDOMEntities',
  factory: {
    create({ app }) {

      app.fragments.push(
        ...createKeyCommandFragments({ app }),
        ...createEntityFragments({ app }),
        ...createPreviewRepFragments({ app }),
        ...createCSSUnitFragments({ app }),
        ...createEditorLayerLabelFragments({ app })
      );

      //registerStyleInputs(app);
      registerSelectors(app);
    }
  }
});

function createComponentStyleFragment(name, type, componentClass) {
  return ComponentFragment.create({
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
    layout: [
      [ 'display'  , TextInputComponent ],
      [ 'position' , TextInputComponent ],

      // drop menu of options ere
      [ 'float'        , TextInputComponent ],

      [ 'margin'       , UnitInputComponent ],
      [ 'marginLeft'   , UnitInputComponent ],
      [ 'marginTop'    , UnitInputComponent ],
      [ 'marginRight'  , UnitInputComponent ],
      [ 'marginBottom' , UnitInputComponent ],

      [ 'padding'       , UnitInputComponent ],
      [ 'paddingLeft'   , UnitInputComponent ],
      [ 'paddingTop'    , UnitInputComponent ],
      [ 'paddingRight'  , UnitInputComponent ],
      [ 'paddingBottom' , UnitInputComponent ]
    ],
    transform: [

      // need to display warning if position is static
      [ 'left'   , UnitInputComponent ],
      [ 'top'    , UnitInputComponent ],
      [ 'width'  , UnitInputComponent ],
      [ 'height' , UnitInputComponent ],

      // css3
      [ 'transform', TextInputComponent ]
    ],
    typography: [
      [ 'fontFamily'     , FontInputComponent      ],
      [ 'fontSize'       , UnitInputComponent      ],

      // http://www.w3schools.com/cssref/pr_font_font-style.asp
      [ 'fontStyle'      , TextInputComponent      ],
      [ 'fontWeight'     , TextInputComponent      ],

      // http://www.w3schools.com/cssref/pr_text_text-decoration.asp
      [ 'textDecoration' , TextInputComponent      ],
      [ 'textAlign'      , TextAlignInputComponent ],
      [ 'wordWrap'       , TextInputComponent      ],

      // drop menu here
      [ 'textOverflow'  , TextInputComponent   ],
      [ 'color'      , ColorPickerComponent    ]
    ],
    appearance: [

      // https://developer.mozilla.org/en-US/docs/Web/CSS/background
      [ 'background'   , BackgroundInputComponent ],
      [ 'borderRadius' , UnitInputComponent       ],

      // TODO - box shadow component here
      [ 'boxShadow'    , TextInputComponent       ],

      // TODO - slider component from 0 - 100
      [ 'opacity'      , UnitInputComponent       ],

      [ 'border'       , TextInputComponent       ],
      [ 'borderLeft'   , TextInputComponent       ],
      [ 'borderTop'    , TextInputComponent       ],
      [ 'borderRight'  , TextInputComponent       ],
      [ 'borderBottom' , TextInputComponent       ],

      // https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode
      [ 'mixBlendMode' , TextInputComponent       ]
    ]
  }

  for (var type in inf) {

    for (var [styleName, componentClass] of inf[type]) {
      app.fragments.push(createComponentStyleFragment(styleName, type, componentClass));
    }

    app.fragments.push(
      EntityPaneComponentFragment.create({
        id             : type + 'PaneComponent',

        // TODO - use uppercase lib
        label          : inflection.titleize(type),
        styleType      : type,
        paneType       : 'entity',
        entityType     : 'component',
        componentClass : StylePaneComponent
      }),
    )
  }

  // default style input
  app.fragments.push(
    ComponentFragment.create({
      id             : 'styleInputCoponent',
      componentType  : 'styleInput',
      componentClass : TextInputComponent
    })
  );
}

function registerSelectors(app) {
  app.fragments.push(
    SelectionFragment.create({
      id     : 'componentSelection',
      entityType: 'component',
      factory: ComponentSelection
    })
  )
}
