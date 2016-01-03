import React from 'react';
import inflection from 'inflection';

class DeclarationComponent extends React.Component {
  removeDeclaration() {
    this.props.reference.setValue(void 0);
  }
  render() {

    // camelCase to Camel Case
    var label = this.props.reference.property.split(/(?=[A-Z])/).map(function(word) {
      return inflection.titleize(word);
    }).join(' ');

    return <div className='m-styles-pane--declaration'>
      <span className='m-styles-pane--declaration-label'>{label}</span> <span className='m-styles-pane--declaration-value'>{
      this.props.fragment.factory.create({
        ...this.props
      })
    }</span>
    <span className='declaration-remove' onClick={this.removeDeclaration.bind(this)}>
        &times;
      </span>
    </div>;
  }
}

class PropertyListComponent extends React.Component {
  render() {

    var properties = this.props.properties;
    var fragments  = this.props.app.fragments;


    var rows = [];

    for (var propertyName in this.props.properties) {

      var declarationFragment = fragments.queryOne({
        ...(this.props.fragmentQuery || {}),
        componentType: 'propertyInput',
        propertyName: propertyName
      });

      if (!declarationFragment) continue;

      rows.push(<DeclarationComponent
        fragment={declarationFragment}
        app={this.props.app}
        fragments={fragments}
        selection={this.props.selection}
        reference={this.props.createReference(propertyName)}
        key={propertyName} />);
    }

    rows = rows.sort(function(a, b) {
      return fragments.indexOf(a.props.fragment) > fragments.indexOf(b.props.fragment) ? 1 : -1;
    });

    return <div className='m-property-list-component'>
      { rows }
    </div>
  }
}

export default PropertyListComponent;