import React from 'react';

import {
  EntityPaneComponentFragment
} from 'editor/fragment/types';

import AttributeReference from 'common/reference/attribute';

import PaneLabel from '../pane-label/index.jsx';
import PaneComponent from 'common/components/pane';
import PropertyListComponent from '../property-list';

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
      <PropertyListComponent
        {...this.props}
        properties={this.props.selection.attributes}
        createReference={AttributeReference.create.bind(AttributeReference, this.props.selection)}
      />
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
