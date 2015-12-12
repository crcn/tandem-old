import React from 'react';
import SearchDropdownComponent from 'common/components/inputs/searchable-dropdown';

class FontInputComponent extends React.Component {
  render() {

    function createLabel(item, i) {
      var style = {
        fontFamily: item.name
      };
      return <span style={style}>{ item.name }</span>;
    }

    var entity = this.props.entity;


    // blast - fix this shit. Fugly code should be somewhere else - not here
    var ref = {
      getValue() {
        return fonts.find((font) => {
          return font.name === entity.attributes.style.fontFamily
        });
      },
      setValue(font) {
        entity.setStyle({
          fontFamily: font.name
        });
      }
    };


    // TODO - this should be a plugin instead
    // Just get this to work for now
    var fonts = (this.props.fonts || []).sort(function(a, b) {
      return a.name > b.name ? -1 : 1;
    });

    return <SearchDropdownComponent className='m-font-input' defaultLabel={'Select Font'} labelProperty={createLabel} items={fonts} reference={ref}>
    </SearchDropdownComponent>;
  }
}

export default FontInputComponent;
