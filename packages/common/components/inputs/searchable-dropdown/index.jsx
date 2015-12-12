import './index.scss';

import cx from 'classnames';
import React from 'react';
import FocusComponent from 'common/components/focus';
import PortalComponent from 'common/components/portal';
import PopdownComponent from 'common/components/popdown';
import { coerceFunction } from 'common/utils/function';
import MenuComponent from 'common/components/menu';

/**
 * Similar to a dropmenu, but aso has search capabilities
 */

class SearchDropdownComponent extends React.Component {

  constructor() {
    super();
    this.state = {}
  }

  toggleMenu() {
    this.setState({
      showMenu   : !this.state.showMenu,
      filter     : void 0,
      focusIndex : this.getInitialFocusIndex()
    });
  }

  hideMenu() {
    this.refs.menu.hide();
  }

  onInputFocus(event) {
    this.setState({
      focusIndex: -1
    });
  }

  onKeyDown(event) {

    var focusIndex = this.state.focusIndex;
    var filteredItems = this.getFilteredItems();

    // down
    if (event.keyCode === 40) {
      focusIndex++;
    } else if (event.keyCode === 38) {
      focusIndex--;
    } else if (event.keyCode === 13) {
      return this.hideMenu();
    }

    focusIndex  = Math.max(-1, Math.min(focusIndex, filteredItems.length - 1))

    // set current item on the reference as the user
    // is moving the arrow keys. This will allow them to
    // preview the font
    if (!!~focusIndex) {
      this.props.reference.setValue(this.getItemValue(filteredItems[focusIndex]));
    }

    this.setState({
      focusIndex: focusIndex
    });
  }

  getFilteredItems() {
    return this.props.items.filter(this.state.filter || function() {
      return true;
    });
  }

  setFilter(event) {

    function defaultCreateFilter(search) {
      search = search.toLowerCase();
      return function(item) {
        // scan all props
        for (var key in item) {
          var value = item[key];
          if (!!~String(value).toLowerCase().indexOf(search)) return true;
        }
      }
    }

    // TODO - get filter
    this.setState({
      filter: defaultCreateFilter(event.target.value)
    });
  }

  onSelectItem(item) {
    this.props.reference.setValue(this.getItemValue(item));
    this.hideMenu();
  }

  getInitialFocusIndex() {
    return this.props.showSearch ? -1 : this.getItemIndex();
  }

  getItemIndex() {
    return this.props.items.findIndex((item) => {
      return this.getItemValue(item) === this.props.reference.getValue();
    });
  }

  getItemValue(item) {
    return this.props.valueProperty ? item[this.props.valueProperty] : item;
  }

  render() {

    var selectedItemIndex = this.getItemIndex();
    var createLabel       = typeof this.props.labelProperty === 'function' ? this.props.labelProperty : (item) => {
      return item[this.props.labelProperty];
  };

    var createDefaultLabel  = coerceFunction(this.props.defaultLabel || 'Select an item');

    var createMenu = () => {

      if (this.props.showSearch !== false) {
        var searchInputSection = <FocusComponent focus={this.state.focusIndex === -1}>
          <input ref='input' type='text' className='form-control' onInput={this.setFilter.bind(this)} onFocus={this.onInputFocus.bind(this)}></input>
        </FocusComponent>;
      }

      return <div
        className='m-search-dropdown--inner'
        onKeyDown={this.onKeyDown.bind(this)}>
        { searchInputSection }
        <ul ref='menuItems' className='m-list'>
          {
            this.getFilteredItems().map((item, i) => {
              return <FocusComponent key={i} focus={ this.state.focusIndex === i }>
                <li
                  tabIndex="-1"
                  onClick={this.onSelectItem.bind(this, item)}
                  className={((i % 2) ? 'alt' : '')}>{
                    createLabel(item, i)
                  }
                </li>
              </FocusComponent>;
            })
          }
        </ul>
      </div>;
    }

    return <MenuComponent
      ref='menu'
      {...this.props}
      className={['m-search-dropdown', this.props.className].join(' ')}
      createMenu={createMenu}>

      <span ref='label' className='input m-search-dropdown--label' onClick={this.toggleMenu.bind(this)}>{
        ~selectedItemIndex ? createLabel(this.props.items[selectedItemIndex]) : createDefaultLabel()
      }</span>
    </MenuComponent>;
  }
}

SearchDropdownComponent.defaultProps = {
  labelProperty: 'label',
  valueProperty: 'value'
};

export default SearchDropdownComponent;
