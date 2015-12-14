import './unit-input.scss';

import React from 'react';
import SelectInputComponent from 'common/components/inputs/select';
import MenuComponent from 'common/components/menu';
import PopdownComponent from 'common/components/popdown';

function extract(regex, value) {
  var match = String(value).match(regex);
  return match ? match[1] : void 0;
}

class UnitInputComponent extends React.Component {

  constructor() {
    super();
    this.state = {};
  }

  onInput(event) {
    var value = event.target.value;

    var number  = extract(/(^[\d\.]+)/, value);
    var measure = extract(/\w+$/, value);

    if (/[\d\.]+/.test(String(value))) {

      var match  = String(value).match(/([\d\.]+)([\D\.]+)?/);

      var number = String(match[1]);
      var unit   = String(match[2] || "");
      // console.log(number, unit, this.generateAutoCompleteList(number, unit));

      this.setState({
        autoCompleteItems: this.generateAutoCompleteList(number, unit)
      });
    } else {
      // TODO - show auto, inherit, and other props
      this.setState({
        atuoCompleteItems: []
      })
    }
  }

  generateAutoCompleteList(number, b) {

    // TODO - these are plugins
    return ['px', 'em', 'vw', 'vh', 'vmin', 'vmax', '%', 'rem', 'ex', 'mm', 'cm', 'in', 'pt', 'pc'].filter(function(a) {
      return !!~String(a).toLowerCase().indexOf(String(b).toLowerCase());
    }).map(function(units) {
      return {
        label: number + ' ' + units,
        value: number + units
      }
    });
  }

  preview(item) {
    // console.log(item);
  }

  onKeyDown(event) {
    if (event.keyCode === 40) {
      this.refs.select.select(0);
    }
  }

  render() {
    var list = this.state.autoCompleteItems || [];

    var sections = {};
    if (list.length) {
      sections.autoComplete = <PopdownComponent>
        <SelectInputComponent ref='select' items={list} onItemHover={this.preview.bind(this)} />
      </PopdownComponent>;
    }

    return <div className='m-unit-input'>
      <input type='text' onInput={this.onInput.bind(this)} onKeyDown={this.onKeyDown.bind(this)} />
      { sections.autoComplete }
    </div>
    return
  }
}

export default UnitInputComponent;
