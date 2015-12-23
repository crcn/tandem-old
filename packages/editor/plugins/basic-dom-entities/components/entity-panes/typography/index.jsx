// import './index.scss';

import React from 'react';
import StyleReference from 'common/reference/style';
import TextInputComponent from 'common/components/inputs/text-input';
import UnitInputComponent from 'common/components/inputs/unit-input';
import ColorInputComponent from 'common/components/inputs/color-picker';
import SearchDropdownComponent from 'common/components/inputs/searchable-dropdown';
import FontInputComponent from './font-input';

import { ALL_FONTS, ALL_FONT_WEIGHTS, ALL_FONT_STYLES } from 'editor/plugin/queries';

function findFont(entity, fonts) {
  return fonts.find(function(font) {
    return entity.attributes.style.fontFamily === font.value;
  });
}

function createMenuItems(values) {
  return (values ? values : []).map(function(value) {
    return { label: value, value: value };
  });
}

const fontWeightMap = {
  100: 'Thin',
  200: 'Extra-Light',
  300: 'Light',
  400: 'Normal',
  500: 'Medium',
  600: 'Demo-Bold',
  700: 'Bold',
  800: 'Ultra Bold',
  900: 'Heavy'
};

class TypographyPaneComponent extends React.Component {
  render() {
    var entity = this.props.entity;

    // TODO - change this to query types
    var fonts            = this.props.app.plugins.query(ALL_FONTS);
    var font             = findFont(entity, fonts) || {};
    var fontStyles       = font.getCombinedStyles().map(function(value) {
      var [weight, style] = value.split(' ');
      if (style === 'normal') style = void 0;
      return {
        label: [weight, '-', fontWeightMap[weight], style].join(' '),
        value: value
      }
    });

    return <div className='m-typography-pane'>

      <div className='container'>
        <div className='row'>
          <div className='col-sm-6'>
            <label>Family</label>
            <FontInputComponent entity={entity} fonts={fonts} />
          </div>
          <div className='col-sm-6'>
            <label>Style</label>
            <SearchDropdownComponent defaultLabel='- -' options={fontStyles} reference={{
              getValue() {
                return [entity.getStyle().fontWeight, entity.getStyle().fontStyle].join(' ');
              },
              setValue(value) {
                var [weight, style] = value.split(' ');
                entity.setStyle({
                  fontWeight : weight,
                  fontStyle  : style
                });
              }
            }} />
          </div>
        </div>

        <div className='row'>
          <div className='col-sm-3'>
            <label>Size</label>
            <UnitInputComponent reference={StyleReference.create(entity, 'fontSize')} />
          </div>
          <div className='col-sm-3'>
            <label>Color</label>
            <ColorInputComponent reference={StyleReference.create(entity, 'color')} />
          </div>
          <div className='col-sm-6'>
            <label>Align</label>
            <TextInputComponent reference={StyleReference.create(entity, 'textAlign')} />
          </div>
        </div>
      </div>

    </div>;
  }
}
export default TypographyPaneComponent;
