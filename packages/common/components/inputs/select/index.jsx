import './index.scss';

import React from 'react';

class SelectComponent extends React.Component {

  constructor() {
    super();

    this.state = {
      position: -1
    };
  }

  shift(step) {
    var items = this.getFilteredItems();
    var newPosition = Math.max(0, Math.min(items.length - 1, this.state.position + step));

    this.onItemHover(items[newPosition]);

    this.setState({
      position: newPosition
    });
  }

  up() {
    this.shift(-1);
  }

  down() {
    this.shift(1);
  }

  onKeyDown(event) {
    if (event.keyCode === 38) {
      this.up();
    } else if (event.keyCode === 40) {
      this.down();
    } else if (event.keyCode === 13) {

    }
  }

  getFilteredItems() {
    return this.props.items.filter(this.props.filter || function() {
      return true;
    });
  }

  select(index) {
    this.setSelectedItem(this.getFilteredItems()[index]);
  }

  setSelectedItem(item) {
    this.props.onSelect(this.getSelectedItemValue());
  }

  onItemHover(item) {
    this.props.onItemHover(this.getItemValue(item));
  }

  getItemValue(item) {
    return item[this.props.valueProperty];
  }

  getSelectedItemValue() {
    // return this.getFilteredItems()
  }

  render() {

    var createLabel = typeof this.props.labelProperty === 'function' ? this.props.labelProperty : (item) => {
      return item[this.props.labelProperty];
    };

    var items = this.props.items || [];

    return <ul className='m-select m-list' onKeyDown={this.onKeyDown.bind(this)}>
      {
        items.map((item, i) => {
          return <li className={i % 2 ? 'alt' : ''} onClick={this.onItemClick.bind(this, item)} onMouseOver={this.onItemHover.bind(this, item)} key={i}>
            { createLabel(item, i) }
          </li>;
        })
      }
    </ul>;
  }
}

SelectComponent.defaultProps = {
  labelProperty : 'label',
  valueProperty : 'value',
  onItemHover   : function() { }
};

export default SelectComponent;
