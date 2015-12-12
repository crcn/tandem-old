import './index.scss';
import { parseColor, stringifyColor } from 'common/utils/color';

import React from 'react';

// http://casesandberg.github.io/react-color/#api-position
import ColorPicker from 'react-color';

class ColorPickerInput extends React.Component {

  constructor() {
    super();
    this.state = { showColorPicker: false };
  }

  showColorPicker() {
    this.setState({
      showColorPicker: true
    });
  }

  onColorChange(color) {
    this.props.reference.setValue(stringifyColor([
      color.rgb.r,
      color.rgb.g,
      color.rgb.b,
      color.rgb.a
    ]));
  }

  render() {
    var ref = this.props.reference;

    var colorValue = ref.getValue() || '#000000';

    var buttonFillStyle = {
      backgroundColor: colorValue
    };

    var [r, g, b, a] = parseColor(colorValue);

    return <div className='m-color-picker-input'>

      <div className='input m-color-picker-input--button'>
        <div style={buttonFillStyle}
          className='m-color-picker-input--button-fill'
          onClick={this.showColorPicker.bind(this)}>
        </div>
      </div>

      <ColorPicker
        display={ this.state.showColorPicker }
        position={this.props.position || 'bottom'}
        color={{ r: r, g: r, b: b, a: a }}
        onChange={this.onColorChange.bind(this)}
        type='chrome' />
    </div>
  }
}

export default ColorPickerInput;
