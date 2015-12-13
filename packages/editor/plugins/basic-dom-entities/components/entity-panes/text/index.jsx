import './index.scss';

import React from 'react';
import Reference from 'common/reference';
import FontInputComponent from './font-input';
import TextInputComponent from 'common/components/inputs/text-input';
import UnitInputComponent from 'common/components/inputs/unit-input';
import createStyleReference from './create-style-reference';
import SearchDropdownComponent from 'common/components/inputs/searchable-dropdown';
import ColorPickerInputComponent from 'common/components/inputs/color-picker';
import { ALL_FONTS, ALL_FONT_WEIGHTS, ALL_FONT_STYLES } from 'editor/plugin/queries';

/*
Typeface, Weight, Size, Alignment, Width, Spacing, Opacity, Filters, display type, floating, weight, line height
*/

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

class TextPaneComponent extends React.Component {
  render() {
    var entity = this.props.entity;

    // TODO - change this to query types
    var fonts            = this.props.app.plugins.query(ALL_FONTS);
    var font             = findFont(entity, fonts) || {};
    var fontWeights      = createMenuItems(font.weights);
    var fontStyles       = createMenuItems(font.styles);
    var fontDecorations  = createMenuItems(font.decorations);

    // TODO - need to combine font styles into one drop menu
    return <div className='m-text-pane'>
      <FontInputComponent entity={entity} fonts={fonts} />
      <ColorPickerInputComponent reference={createStyleReference(entity, 'color')} />

      <SearchDropdownComponent
        defaultLabel='Font Weight'
        reference={createStyleReference(entity, 'fontWeight')}
        items={fontWeights}
        disable={!fontWeights.length} />

      <SearchDropdownComponent
        defaultLabel='Font Style'
        reference={createStyleReference(entity, 'fontStyle')}
        items={fontStyles}
        disable={!fontStyles.length} />


      <SearchDropdownComponent
        defaultLabel='Font Decorations'
        reference={createStyleReference(entity, 'textDecoration')}
        items={fontDecorations}
        disable={!fontDecorations.length} />

      <div>
        <span>x</span> 100px <span>y</span> 100px
      </div>

      <UnitInputComponent reference={createStyleReference(entity, 'fontSize')} />
      <UnitInputComponent reference={createStyleReference(entity, 'lineHeight')} />
      <UnitInputComponent reference={createStyleReference(entity, 'width')} />
      <UnitInputComponent reference={createStyleReference(entity, 'height')} />
      <UnitInputComponent reference={createStyleReference(entity, 'left')} />
      <UnitInputComponent reference={createStyleReference(entity, 'top')} />
    </div>;
  }
}

export default TextPaneComponent;
