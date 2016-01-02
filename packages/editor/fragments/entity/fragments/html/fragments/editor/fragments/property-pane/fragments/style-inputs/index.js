import {
  LAYOUT,
  TYPOGRAPHY,
  TRANSFORM,
  APPEARANCE
} from '../../categories';

import {
  ComponentFragment
} from 'editor/fragment/types';

import FontInputComponent from './components/font';
import TextInputComponent from 'common/components/inputs/text';
import UnitInputComponent from 'common/components/inputs/unit';
import TextAlignInputComponent from './components/text-align';
import BackgroundInputComponent from './components/background';
import ColorPickerComponent from 'common/components/inputs/color-picker';

export function create({ app }) {
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

  for (var category in inf) {

    for (var [styleName, componentClass] of inf[category]) {
      fragments.push(createComponentStyleFragment(styleName, category, componentClass));
    }
  }

  return fragments;
}


function createComponentStyleFragment(name, category, componentClass) {
  return ComponentFragment.create({
    id             : name + 'StyleInputComponent',
    componentType  : 'styleInput',
    componentClass : componentClass,
    styleName      : name,
    styleCategory  : category
  })
}
