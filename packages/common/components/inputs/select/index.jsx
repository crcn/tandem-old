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
    var items = this.getFilteredItems();
    var newPosition = Math.max(-1, Math.min(items.length - 1, position));

    if (!!~newPosition) {
      this.onItemHover(items[newPosition]);
      this.onItemSelect(items[newPosition]);
      var item = this.refs.list.querySelectorAll('li')[newPosition];
      item.scrollIntoView(false);
    }

    this.setState({
      position: newPosition
    });
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

  getFilteredItems() {
    return this.props.items.filter(this.props.filter || function() {
      return true;
    });
  }

  onItemHover(item) {
    this.props.onItemHover(this.getItemValue(item));
  }

  onItemSelect(item) {
    this.props.onSelect(this.getItemValue(item));
  }

  getItemValue(item) {
    return item ? item[this.props.valueProperty] : void 0;
  }

  getCurrentItemValue() {
    return this.getItemValue(
      this.getFilteredItems()[this.state.position]
    );
  }

  render() {

    var createLabel = typeof this.props.labelProperty === 'function' ? this.props.labelProperty : (item) => {
      return item[this.props.labelProperty];
    };

    var items    = this.getFilteredItems();
    var position = this.state.position;

    return <ul ref='list' className='m-select m-list'>
      {
        items.map((item, i) => {
          var classNames = cx({
            'alt'      : !!(i % 2),
            'selected' : position === i
          })
          return <li
            className={classNames}
            onClick={this.move.bind(this, i)}
            onMouseOver={this.onItemHover.bind(this, item)} key={i}>
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
  onItemHover   : function() { },
  onSelect      : function() { }
};

export default SelectComponent;
