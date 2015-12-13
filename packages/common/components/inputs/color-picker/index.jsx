import './index.scss';
import { diff } from 'common/utils/object';
import MenuComponent from 'common/components/menu';
import PointerComponent from './pointer';
import { parseColor, stringifyColor } from 'common/utils/color';
import { chrome as ColorPickerComponent } from 'react-color';

import React from 'react';

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

  onKeyDown(event) {
    if (event.keyCode !== 13 || !this.refs.menu.state.show) return;
    this.refs.menu.hide();
  }

  render() {
    var ref = this.props.reference;

    var colorValue = ref.getValue() || '#000000';

    var buttonFillStyle = {
      backgroundColor: colorValue
    };

    var createMenu = () => {
      var [r, g, b, a] = parseColor(colorValue);
      return <div className='m-color-picker-popdown--outer'>
        <ColorPickerComponent color={{
          r: r,
          g: g,
          b: b,
          a: a
        }} onChange={this.onColorChange.bind(this)}  />
      </div>
    }

    return <div c
      lassName='m-color-picker-input' onBlur={() => this.refs.menu.hide() } onKeyDown={this.onKeyDown.bind(this)}>

      <MenuComponent ref='menu' className='m-color-picker-popdown' createMenu={createMenu}>

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
