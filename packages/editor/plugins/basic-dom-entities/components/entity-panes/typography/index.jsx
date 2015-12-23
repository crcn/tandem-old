
import React from 'react';
import TextInputComponent from 'common/components/inputs/text-input';
import UnitInputComponent from 'common/components/inputs/unit-input';
import ColorInputComponent from 'common/components/inputs/color-picker';
import StyleReference from 'common/reference/style';
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

class TypographyPaneComponent extends React.Component {
  render() {
    var entity = this.props.app.focus;

    // TODO - change this to query types
    var fonts            = this.props.app.plugins.query(ALL_FONTS);
    var font             = findFont(entity, fonts) || {};
    var fontWeights      = createMenuItems(font.weights);
    var fontStyles       = createMenuItems(font.styles);
    var fontDecorations  = createMenuItems(font.decorations);

    return <div className='m-typography-pane'>

      <div className='container'>
        <div className='row'>
          <div className='col-sm-6'>
            <label>Family</label>
            <FontInputComponent entity={entity} fonts={fonts} />
          </div>
          <div className='col-sm-6'>
            <label>Style</label>
            <TextInputComponent reference={StyleReference.create(entity, 'weight')}/>
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
            <input type='text'></input>
          </div>
        </div>
      </div>

    </div>;
  }
}
export default TypographyPaneComponent;
