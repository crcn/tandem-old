import {
  ComponentFragment
} from 'editor/fragment/types';

import TextInputComponent from 'common/components/inputs/text';

export function createFragments({ app }) {
  return [
    createComponentPropertyFragment('src', 'properties', TextInputComponent)
  ]
}

function createComponentPropertyFragment(name, category, componentClass) {
  return ComponentFragment.create({
    id             : name + 'StyleInputComponent',
    componentType  : 'propertyInput',
    componentClass : componentClass,
    propertyName   : name,
    styleCategory  : category
  })
}