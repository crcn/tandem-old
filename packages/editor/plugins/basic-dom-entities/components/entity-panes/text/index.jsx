import './index.scss';

import React from 'react';
import Reference from 'common/reference';
import FontInputComponent from './font-input';
import TextInputComponent from 'common/components/inputs/text-input';
import ColorPickerInputComponent from 'common/components/inputs/color-picker';
import SearchDropdownComponent from 'common/components/inputs/searchable-dropdown';
import createStyleReference from './create-style-reference';

/*
Typeface, Weight, Size, Alignment, Width, Spacing, Opacity, Filters, display type, floating, weight, line height
*/

class TextPaneComponent extends React.Component {
  render() {
    var entity = this.props.entity;

    var fonts = this.props.app.plugins.query({ type: 'font' });

    // TODO - these need to be placed elsewhere - like a plugin
    var fontWeights = [
      'normal', 'bold', 'bolder', 'lighter', 'initial', 'inherit', 100, 200, 300, 400, 500, 600, 700, 800, 900
    ].map(function(weight) {
      return { label: weight, value: weight };
    });

    // TODO - need to combine font styles into one drop menu
    return <div className='m-text-pane'>
      <FontInputComponent entity={entity} fonts={fonts} />
      <TextInputComponent reference={Reference.create(entity, 'value')} />
      <ColorPickerInputComponent reference={createStyleReference(entity, 'color')} />
      <SearchDropdownComponent
        defaultLabel='Font Weight'
        reference={createStyleReference(entity, 'fontWeight')}
        items={fontWeights} />
    </div>;
  }
}

export default TextPaneComponent;
