import './index.scss';

import React from 'react';
import inflection from 'inflection';
import PaneComponent from 'common/components/pane';
import StyleReference from 'common/reference/style';
import PaneLabel from '../../pane-label/index.jsx';
import PropertyListComponent from '../../property-list';

class StyleDeclarationComponent extends React.Component {
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

class EntityStylesPaneComponent extends React.Component {

  addStyle() {
    this.props.selection.setStyle({
      [prompt('style name')]: prompt('value')
    })
  }

  render() {

    var selection    = this.props.selection;


    var styles = selection.getStyle();

    var label = <PaneLabel onAdd={this.addStyle.bind(this)}>
      { this.props.fragment.label }
    </PaneLabel>;

    return <PaneComponent label={label}>
      <div className='m-styles-pane'>
        <PropertyListComponent
          {...this.props}
          fragmentQuery={{styleCategory:this.props.fragment.styleCategory}}
          properties={styles}
          createReference={StyleReference.create.bind(StyleReference, selection)}
        />
      </div>
    </PaneComponent>;
  }
}

export default EntityStylesPaneComponent;