import {
  ComponentFragment,
  EntityPaneComponentFragment
} from 'editor/fragment/types';

import inflection from 'inflection';
import StylePaneComponent from './style-pane';
import TextInputComponent from 'saffron-common/components/inputs/text';
import UnitInputComponent from 'saffron-common/components/inputs/unit';
import FontInputComponent from './style-inputs/font';
import ColorPickerComponent from 'saffron-common/components/inputs/color-picker';
import TextAlignInputComponent from './style-inputs/text-align';
import BackgroundInputComponent from './style-inputs/background';

import { LAYOUT, TRANSFORM, APPEARANCE, TYPOGRAPHY } from './categories';

export function create({ app }) {

  return [
    ...createStyleInputFragments({ app }),
    ...createEditorPaneFragments({ app })
  ];
}

function createStyleInputFragments({ app }) {
  var fragments = [];

  var inf = {
    [LAYOUT]: [
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
    [TRANSFORM]: [

      // need to display warning if position is static
      [ 'left'   , UnitInputComponent ],
      [ 'top'    , UnitInputComponent ],
      [ 'width'  , UnitInputComponent ],
      [ 'height' , UnitInputComponent ],

      // css3
      [ 'transform', TextInputComponent ]
    ],
    [TYPOGRAPHY]: [
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
    [APPEARANCE]: [

      // https://developer.mozilla.org/en-US/docs/Web/CSS/background
      [ 'background'   , TextInputComponent ],
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

  for (var category in inf) {

    for (var [styleName, componentClass] of inf[category]) {
      fragments.push(createComponentStyleFragment(styleName, category, componentClass));
    }
  }

  return fragments;
}


function createComponentStyleFragment(name, category, componentClass) {

  // /entityStyleComponents/[name]
  return ComponentFragment.create({
    id             : name + 'StyleInputComponent',
    namespace      : 'inputComponents/' + name,
    componentType  : 'propertyInput',
    propertyType   : 'style',
    componentClass : componentClass,
    propertyName   : name,
    styleCategory  : category
  })
}

function createEditorPaneFragments({ app }) {

  // /entityPaneComponents/component
  return [EntityPaneComponentFragment.create({
      id             : 'stylePaneComponent',

      // TODO - use uppercase lib
      label          : inflection.titleize('style'),
      namespace      : 'panes/entity/component',
      styleCategory  : 'style',
      paneType       : 'entity',
      entityType     : 'component',
      componentClass : StylePaneComponent
    })];
}
//
//function createEditorPaneFragments({ app }) {
//  return [LAYOUT, TRANSFORM, TYPOGRAPHY, APPEARANCE].map(function(category) {
//    return EntityPaneComponentFragment.create({
//      id             : category + 'PaneComponent',
//
//      // TODO - use uppercase lib
//      label          : inflection.titleize(category),
//      styleCategory  : category,
//      propertyType   : 'style',
//      paneType       : 'entity',
//      entityType     : 'component',
//      componentClass : StylePaneComponent
//    })
//  });
//}
