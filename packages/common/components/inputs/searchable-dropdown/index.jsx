import './index.scss';

import cx from 'classnames';
import React from 'react';
import FocusComponent from 'common/components/focus';
import PortalComponent from 'common/components/portal';
import { coerceFunction } from 'common/utils/function';

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
      focusIndex : -1
    });
  }

  componentDidMount() {
    document.body.addEventListener('mousedown', this.onBodyDown);
  }

  onBodyDown = (event) => {
    if (!this.refs.menu || this.refs.menu.contains(event.target)) {
      return;
    }
    this.hideMenu();
  }

  hideMenu() {
    this.setState({
      showMenu: false,
      filter: void 0
    });
  }

  onInputFocus(event) {
    this.setState({
      focusIndex: -1
    });
  }

  componentWillUnmount() {
    document.body.removeEventListener('mousedown', this.onBodyDown);
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
      this.props.reference.setValue(filteredItems[focusIndex]);
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
          if (typeof value !== 'string') continue;
          if (!!~value.toLowerCase().indexOf(search)) return true;
        }
      }
    }

    // TODO - get filter
    this.setState({
      filter: defaultCreateFilter(event.target.value)
    });
  }

  onSelectItem(item) {
    this.props.reference.setValue(item);
    this.hideMenu();
  }

  render() {

    var selectedItem        = this.props.reference.getValue();
    var createLabel         = coerceFunction(this.props.labelProperty || 'label');
    var createDefaultLabel  = coerceFunction(this.props.defaultLabel || 'Select an item');

    var sections = { };

    if (this.state.showMenu) {

      if (this.props.showSearch !== false) {
        sections.search = <FocusComponent focus={this.state.focusIndex === -1}>
          <input ref='input' type='text' className='form-control' onInput={this.setFilter.bind(this)} onFocus={this.onInputFocus.bind(this)}></input>
        </FocusComponent>;
      }

      sections.menu = <div ref='menu' className='m-search-dropdown--menu'>
        <div className='arrow-box'></div>
        { sections.search }
        <ul ref='menuItems' className='m-list'>
          {
            this.getFilteredItems().map((item, i) => {
              return <FocusComponent key={i} focus={ this.state.focusIndex === i }><li tabIndex="-1"  onClick={this.onSelectItem.bind(this, item)} className={((i % 2) ? 'alt' : '')}>{ createLabel(item, i) }</li></FocusComponent>;
            })
          }
        </ul>
      </div>;
    }

    return <div className={['m-search-dropdown', this.props.className].join(' ')} onKeyDown={this.onKeyDown.bind(this)}>

      <span ref='label' className='input m-search-dropdown--label' onClick={this.toggleMenu.bind(this)}>{
        selectedItem ? createLabel(selectedItem) : createDefaultLabel()
      }</span>

      { sections.menu }
    </div>;
  }
}

export default SearchDropdownComponent;
