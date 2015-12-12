import './index.scss';
import { parseColor, stringifyColor } from 'common/utils/color';
import { diff } from 'common/utils/object';
import PointerComponent from './pointer';
import ColorPickerDropdownComponent from './picker';
import MenuComponent from 'common/components/menu';

import React from 'react';

// http://casesandberg.github.io/react-color/#api-position
import ColorPicker from 'react-color';

class ColorPickerInput extends React.Component {

  constructor() {
    super();
  }

  onColorChange(color) {
    this.props.reference.setValue(stringifyColor([
      color.rgb.r,
      color.rgb.g,
      color.rgb.b,
      color.rgb.a
    ]));
  }

  /**
   * color picker is slow. Make sure we don't do unecessary renders.
   */

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.reference !== this.props.reference || !!Object.keys(diff(this.state, nextState)).length;
  }

  render() {
    var ref = this.props.reference;

    var colorValue = ref.getValue() || '#000000';

    var buttonFillStyle = {
      backgroundColor: colorValue
    };

    function createMenu() {
      var [r, g, b, a] = parseColor(colorValue);
      return <ColorPickerDropdownComponent color={{
        r: r,
        g: g,
        b: b,
        a: a
      }} />;
    }

    return <div className='m-color-picker-input'>

      <MenuComponent className='m-color-picker-popdown' createMenu={createMenu}>

        <div className='input m-color-picker-input--button'>
          <div style={buttonFillStyle}
            className='m-color-picker-input--button-fill'>
          </div>
        </div>

      </MenuComponent>

    </div>
  }
}

export default ColorPickerInput;
