
import React from 'react';
import StyleReference from 'common/reference/style';
import SearchDropdownComponent from 'common/components/inputs/searchable-dropdown';


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


class FontInputComponent extends React.Component {
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

    function createLabel(item, i) {
      var style = {
        fontFamily: item.value
      };
      return <span style={style}>{ item.label }</span>;
    }


    // TODO - this should be a plugin instead
    // Just get this to work for now
    fonts = (fonts || []).sort(function(a, b) {
      return a.label > b.label ? -1 : 1;
    });

    return <SearchDropdownComponent className='input m-font-input' defaultLabel={'Select Font'} labelProperty={createLabel} options={fonts} reference={StyleReference.create(entity, 'fontFamily')}>
    </SearchDropdownComponent>;
  }
}

export default FontInputComponent;
