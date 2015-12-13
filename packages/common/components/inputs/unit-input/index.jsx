import './index.scss';
import React from 'react';
import { shutUpChange } from 'common/utils/component';

class UnitInputComponent extends React.Component {

  onNumberInputKeyDown(event) {
    var v = Number(event.target.value);

    if (event.keyCode === 38) {
      v += 1;
    } else if (event.keyCode === 40){
      v -= 1;
    } else {
      return;
    }

    event.target.value = String(Math.max(this.props.min, v));

    this.setReferenceValue();
    event.target.setSelectionRange(0, event.target.value.length);
  }

  // shouldComponentUpdate(nextProps) {
  //   return true;
  //   // return this.props.reference.getValue() !== nextProps.reference.getValue();
  // }

  setReferenceValue() {
    this.props.reference.setValue(this.refs.number.value + this.refs.units.value);
  }

  render() {

    var value     = this.props.reference.getValue();
    var unitParts = String(value).match(/([\d\.]+)((\w+)|%)?/) || [];

    var num  = String(unitParts[1] || '');
    var unit = String(unitParts[2] || '');


    return <div className='m-unit-input'>
      <input
        className='input mousetrap'
        ref='number'
        type='text'
        onInput={this.setReferenceValue.bind(this)}
        onKeyDown={this.onNumberInputKeyDown.bind(this)}
        onChange={shutUpChange}
        value={num}></input>

      <input
        className='input mousetrap'
        ref='units'
        type='text'
        onInput={this.setReferenceValue.bind(this)}
        onChange={shutUpChange}
        value={unit}></input>
    </div>;
  }
}

UnitInputComponent.defaultProps = {
  min: 0
};

export default UnitInputComponent;
