import './index.scss';

import React from 'react';
import StyleReference from 'common/reference/style';
import FontInputComponent from './font-input';
import TextInputComponent from 'common/components/inputs/text-input';
import UnitInputComponent from 'common/components/inputs/unit-input';
import ColorPickerComponent from 'common/components/inputs/color-picker';
import { RadioGroupInputComponent, RadioGroupItemComponent } from 'common/components/inputs/radio-group';

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
  left(props) {
    return <UnitInputComponent {...props} />;
  },
  top(props) {
    return <UnitInputComponent {...props} />;
  },
  width(props) {
    return <UnitInputComponent {...props} />;
  },
  height(props) {
    return <UnitInputComponent {...props} />;
  },
  textAlign(props) {
    return <RadioGroupInputComponent {...props}>
      <RadioGroupItemComponent value='left'>
        <i className='s s-align-left'></i>
      </RadioGroupItemComponent>
      <RadioGroupItemComponent value='justify'>
        <i className='s s-align-justify'></i>
      </RadioGroupItemComponent>
      <RadioGroupItemComponent value='center'>
        <i className='s s-align-center'></i>
      </RadioGroupItemComponent>
      <RadioGroupItemComponent value='right'>
        <i className='s s-align-right'></i>
      </RadioGroupItemComponent>
    </RadioGroupInputComponent>;
  },
  color(props) {
    return <ColorPickerComponent className='input' {...props} />;
  },
  fontFamily(props) {
    return <FontInputComponent {...props} />;
  },
  fontSize(props) {
    return <UnitInputComponent {...props} />;
  },
  position(props) {
    return null;
  }
}

var order = [

  // transform
  'left', 'top', 'width', 'height', 'position',

  // typography
  'fontFamily', 'fontSize', 'textAlign', 'color'
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
