import './index.scss';

import React from 'react';
import Reference from 'common/reference';
import FontInputComponent from './font-input';
import TextInputComponent from 'common/components/inputs/text-input';
import ColorPickerInputComponent from 'common/components/inputs/color-picker';
import SearchDropdownComponent from 'common/components/inputs/searchable-dropdown';

function createStyleReference(entity, styleName) {
  return {
    getValue() {
      return entity.attributes.style[styleName];
    },
    setValue(value) {
       entity.setStyle({
         [styleName]: value
       })
    }
  };
}

/*
Typeface, Weight, Size, Alignment, Width, Spacing, Opacity, Filters, display type, floating, weight, line height
*/

class TextPaneComponent extends React.Component {
  render() {
    var entity = this.props.entity;

    // TODO - this should be a plugin instead
    // Just get this to work for now
    var fonts = (this.props.app.fonts || []);

// <NumberInputComponent reference={createStyleReference(entity, 'fontSize' )} />
    return <div className='m-text-pane'>
      <FontInputComponent entity={entity} fonts={fonts} />
      <TextInputComponent reference={Reference.create(entity, 'value')} />
      <ColorPickerInputComponent reference={createStyleReference(entity, 'color')} />
      <SearchDropdownComponent
        showSearch={false}
        showArrow={false}
        reference={createStyleReference(entity, 'fontWeight')}
        items={['normal', 'bold', 'italic', 'underline']} />
    </div>;
  }
}

export default TextPaneComponent;
