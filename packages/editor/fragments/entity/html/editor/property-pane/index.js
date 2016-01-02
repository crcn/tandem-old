import {
  EntityPaneComponentFragment
} from 'editor/fragment/types';

import StylePaneComponent from './components/style-pane';
import inflection from 'inflection';

import { create as createStyleInputFragments } from './fragments/style-inputs';
import { LAYOUT, TRANSFORM, APPEARANCE, TYPOGRAPHY } from './categories';

export function create({ app }) {

  return [
    ...createStyleInputFragments({ app }),
    ...[LAYOUT, TRANSFORM, TYPOGRAPHY, APPEARANCE].map(function(category) {
      return EntityPaneComponentFragment.create({
        id             : category + 'PaneComponent',

        // TODO - use uppercase lib
        label          : inflection.titleize(category),
        styleCategory  : category,
        paneType       : 'entity',
        entityType     : 'component',
        componentClass : StylePaneComponent
      })
    })
  ];
}