// FIXME: overly sophisticated number input is overly gross
// to look at. Clean me.

import './index.scss';

import React from 'react';
import MenuComponent from 'common/components/menu';
import PopdownComponent from 'common/components/popdown';
import SelectInputComponent from 'common/components/inputs/select';

function extract(regex, value) {
  var match = String(value).match(regex);
  return match ? match[1] : void 0;
}

class UnitInputComponent extends React.Component {

  constructor() {
    super();
    this.state = {};
  }

  updateAutoComplete() {
    if (!this.state.showAutocomplete) return;

    var value = this.refs.input.value;

    var number  = extract(/(^[\d\.]+)/, value);
    var measure = extract(/\w+$/, value);

    if (/[\d\.]+/.test(String(value))) {

      var parts = this.getInputParts();

      this.setState({
        autoCompleteItems: this.generateAutoCompleteList(parts.value, parts.unit)
      });
    } else {
      // TODO - show auto, inherit, and other props
      this.setState({
        atuoCompleteItems: []
      })
    }
  }

  showAutocomplete() {
    this.setState({
      showAutocomplete: true
    });
  }

  updateReference() {
    this.props.reference.setValue(this.refs.input.value);
    this.updateAutoComplete();
  }

  generateAutoCompleteList(number, b) {

    // TODO - these should be plugins
    return ['px', 'em', 'vw', 'vh', 'vmin', 'vmax', '%', 'rem', 'ex', 'mm', 'cm', 'in', 'pt', 'pc'].filter(function(a) {
      return !!~String(a).toLowerCase().indexOf(String(b).toLowerCase());
    }).map(function(units) {
      return {
        label: number + '' + units,
        value: number + units
      }
    });
  }

  preview(value) {
    this.previewValue = value;
    this.props.reference.setValue(value);
  }

  onKeyDown(event) {

    var handlers = {
      40: this.increment.bind(this, -1),
      38: this.increment.bind(this, 1)
    };

    var select = this.refs.select;

    if (select) {
      Object.assign(handlers, {
        40: select.down.bind(select),
        38: select.up.bind(select),
        13: () => {
          var value = this.refs.select.getCurrentItemValue();
          if (value != void 0) this.update(value);
          this.hideList();
        }
      });
    }

    var handler = handlers[event.keyCode];
    if (handler) {
      handler();
      event.preventDefault();
    }
  }

  componentDidMount() {
    this.calculateIncrement();
  }

  calculateIncrement() {
    var v   = this.getInputParts().value;
    if (v === 0) return 1;

    // only decimal
    var cv = v;
    var i  = 0;

    while(cv % 1 !== 0 && i < 4) {
      cv *= 10;
      i++;
    }

    this.incrementAmount = 1 / Math.pow(10, i);
  }

  componentWillReceiveProps(nextProps) {
    var nv = this.props.reference.getValue();
    if (nv !== this.previewValue && nv !== this.refs.input.value) {
      this.update(nv);
    }
  }

  moveCursorToEnd() {
    var val = event.target.value;
    event.target.value = '';
    event.target.value = val;
  }

  update(value) {

    if (value != void 0) {
      this.refs.input.value = value;
    } else {
      // manually input the value
      this.calculateIncrement();
      this.showAutocomplete();
    }

    this.props.reference.setValue(this.refs.input.value);
    this.updateAutoComplete();
  }

  increment(multiplier) {
    var parts = this.getInputParts();
    var amount = this.incrementAmount * multiplier;
    var v = Number((parts.value + amount)).toFixed(this.incrementAmount !== 1 ? String(this.incrementAmount).split('.').pop().length : 0);
    this.update(String(v) + parts.unit);
    this.refs.input.select();
  }

  getInputParts() {
    var match  = String(this.refs.input.value).match(/([-\d\.]+)([\D\.]+)?/);

    return {
      value : match ? Number(match[1]) : 0,
      unit  : match ? String(match[2] || "") : ""
    };
  }

  hideList() {
    this.setState({
      showAutocomplete: false
    })
  }

  onBlur(event) {
    this.hideList();
  }

  render() {
    var list = this.state.autoCompleteItems || [];
    var ref = this.props.reference;

    var sections = {};
    if (this.state.showAutocomplete) {
      sections.autoComplete = <PopdownComponent>
        <SelectInputComponent ref='select' items={list} onItemHover={this.preview.bind(this)} />
      </PopdownComponent>;
    }

    return <div className='input m-unit-input'>
      <input
        ref='input'
        type='text'
        defaultValue={ref.getValue()}
        onChange={this.update.bind(this, void 0)}
        onKeyDown={this.onKeyDown.bind(this)}
        onBlur={this.onBlur.bind(this)} />
      { sections.autoComplete }
    </div>;
  }
}

export default UnitInputComponent;
