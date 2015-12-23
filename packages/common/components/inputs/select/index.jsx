import './index.scss';

import React from 'react';
import cx from 'classnames';

class SelectComponent extends React.Component {

  constructor() {
    super();

    this.state = {
      position: -1
    };
  }

  move(position) {
    var options = this.getFilteredOptions();
    var newPosition = Math.max(-1, Math.min(options.length - 1, position));

    if (!!~newPosition) {
      this.onOptionHover(options[newPosition]);
      var option = this.refs.list.querySelectorAll('li')[newPosition];
      option.scrollIntoView(false);
    }

    this.setState({
      position: this.state.position = newPosition
    });

    if (this.props.onPositionChange) {
      this.props.onPositionChange(newPosition);
    }
  }

  shift(step) {
    this.move(this.state.position + step);
  }

  up() {
    this.shift(-1);
  }

  down() {
    this.shift(1);
  }

  getFilteredOptions() {
    return this.props.options.filter(this.props.filter || function() {
      return true;
    });
  }

  onOptionHover(option) {
    this.props.onOptionHover(this.getOptionValue(option));
  }

  getOptionValue(option) {
    return option ? option[this.props.valueProperty] : void 0;
  }

  getCurrentOptionValue() {
    return this.getOptionValue(
      this.getFilteredOptions()[this.state.position]
    );
  }

  onOptionClick(index, event) {
    event.stopPropagation();
    this.move(index);
    console.log(index, this.getCurrentOptionValue(), this.state.position);
    this.selectCurrentPosition();
  }

  onKeyDown(event) {
    if (event.keyCode === 38) {
      this.up();
      event.preventDefault();
      event.stopPropagation();
    } else if (event.keyCode === 40) {
      this.down();
      event.preventDefault();
      event.stopPropagation();
    } else if (event.keyCode === 13) {
      this.selectCurrentPosition();
    }
  }

  selectCurrentPosition() {
    this.props.onSelect(this.getCurrentOptionValue());
  }

  onFocus(event) {
    this.move(0);
  }

  onBlur(event) {
    this.move(-1);
  }

  focus() {
    this.refs.list.focus();
  }

  render() {

    var createLabel = typeof this.props.labelProperty === 'function' ? this.props.labelProperty : (option) => {
      return option[this.props.labelProperty];
    };

    var options    = this.getFilteredOptions();
    var position = this.state.position;

    return <ul ref='list' className='m-select m-list' onFocus={this.onFocus.bind(this)} onBlur={this.onBlur.bind(this)} tabIndex="0" onKeyDown={this.onKeyDown.bind(this)} data-mouse-trap="false">
      {
        options.map((option, i) => {
          var classNames = cx({
            'alt'      : !!(i % 2),
            'selected' : position === i
          })
          return <li
            className={classNames}
            onMouseDown={this.onOptionClick.bind(this, i)}
            onMouseOver={this.onOptionHover.bind(this, option)} key={i}>
            { createLabel(option, i) }
          </li>;
        })
      }
    </ul>;
  }
}

SelectComponent.defaultProps = {
  labelProperty : 'label',
  valueProperty : 'value',
  onOptionHover   : function() { },
  onSelect      : function() { }
};

export default SelectComponent;
