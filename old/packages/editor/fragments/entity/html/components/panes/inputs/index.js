import {
  ComponentFragment
} from 'editor/fragment/types';

import TextInputComponent from 'saffron-common/components/inputs/text';

export function createFragments({ app }) {

  var propFragments = [
    'id',  'class', 'src'
  ].map(function(propName) {
    return createComponentPropertyFragment(propName, 'properties', TextInputComponent)
  });

  return propFragments;
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