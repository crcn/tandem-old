import './picker.scss';
import React from 'react';
import PointerComponent from './pointer';
import PopdownComponent from 'common/components/popdown';
import ColorPickerComponent from 'react-color';

import {
  Saturation as SaturationComponent
} from 'react-color/lib/components/common';


class CustomPickerComponent extends React.Component {
  render() {
    return <div className='m-color-picker-popdown--outer'>
      <div className='m-color-picker-popdown--inner'>
        <SaturationComponent pointer={PointerComponent} {...this.props} />;
      </div>
    </div>;
  }
}


class DropdownColorPickerComponent extends React.Component {
  render() {
    return <ColorPickerComponent custom={CustomPickerComponent} />;
  }
}

export default DropdownColorPickerComponent;
