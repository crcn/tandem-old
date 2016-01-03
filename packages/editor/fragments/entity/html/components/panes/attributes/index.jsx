import React from 'react';

import {
  EntityPaneComponentFragment
} from 'editor/fragment/types';

import PaneComponent from 'common/components/pane';
import PaneLabel from '../pane-label/index.jsx';

class AttributesPaneComponent extends React.Component {

  addProperty() {
    this.props.selection.setAttribute(
      prompt('property name'),
      prompt('property value')
    );
  }

  render() {
    if (this.props.selection.componentType !== 'element') return null;

    var label = <PaneLabel onAdd={this.addProperty.bind(this)}>Properties</PaneLabel>;

    return <PaneComponent label={label}>

    </PaneComponent>;
  }
}

export default AttributesPaneComponent;

export function createFragment({ app }) {
  return EntityPaneComponentFragment.create({
    id: 'htmlAttributesPane',
    componentClass: AttributesPaneComponent,
    entityType: 'component'
  });
}
