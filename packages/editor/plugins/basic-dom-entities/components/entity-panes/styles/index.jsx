import './index.scss';

import React from 'react';
import StyleReference from 'common/reference/style';
import TextInputComponent from 'common/components/inputs/text-input';
import UnitInputComponent from 'common/components/inputs/unit-input';
import ColorPickerComponent from 'common/components/inputs/color-picker';
import FontInputComponent from './font-input';

class StyleDeclarationComponent extends React.Component {
  render() {

    var entity    = this.props.entity;
    var property  = this.props.property;
    var value     = this.props.value;

    var label = labels[property] || property;

    return <div className='m-styles-pane--declaration'>
      <span className='m-styles-pane--declaration-label'>{label}</span> <span className='m-styles-pane--declaration-value'>{
        valueFactories[property]({
          app       : this.props.app,
          entity    : entity,
          reference : StyleReference.create(entity, property)
        })
      }</span>
    </div>;
  }
}

var valueFactories = {
  left: function(props) {
    return <UnitInputComponent {...props} />;
  },
  top: function(props) {
    return <UnitInputComponent {...props} />;
  },
  color: function(props) {
    return <ColorPickerComponent className='input' {...props} />;
  },
  fontFamily: function(props) {
    return <FontInputComponent {...props} />;
  },
  fontSize: function(props) {
    return <UnitInputComponent {...props} />;
  },
  position: function(props) {
    return null;
  }
}

var order = [

  // transform
  'left', 'top', 'width', 'height', 'position',

  // typography
  'fontFamily', 'fontSize', 'color'
];

var labels = {
  'left'       : 'x',
  'top'        : 'y',
  'fontFamily' : 'Font',
  'fontSize'   : 'Font Size',
  'color'      : 'Font Color'
};

class EntityStylesPaneComponent extends React.Component {

  addStyle(event) {
    this.props.entity.setStyle({
      [prompt('property')]: prompt('value')
    });
  }

  render() {
    var entity = this.props.entity;
    var styles = entity.getStyle();

    var rows = [];

    for (var styleName in styles) {
      rows.push(<StyleDeclarationComponent
        app={this.props.app}
        entity={entity}
        property={styleName}
        value={styles[styleName]}
        key={styleName} />);
    }

    rows = rows.sort(function(a, b) {
      return order.indexOf(a.props.property) > order.indexOf(b.props.property) ? 1 : -1;
    });

    return <div className='m-styles-pane'>
      { rows }
    </div>;
  }
}

export default EntityStylesPaneComponent;
