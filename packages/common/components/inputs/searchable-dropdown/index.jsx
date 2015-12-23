import './index.scss';

import cx from 'classnames';
import React from 'react';
import MenuComponent from 'common/components/menu';
import SelectComponent from 'common/components/inputs/select';
import FocusComponent from 'common/components/focus';
import PortalComponent from 'common/components/portal';
import PopdownComponent from 'common/components/popdown';
import { coerceFunction } from 'common/utils/function';

/**
 * Similar to a dropmenu, but aso has search capabilities
 */

class SearchDropdownComponent extends React.Component {

  constructor() {
    super();
    this.state = {
      focusIndex: -1
    };
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


  onInputFocus(event) {
    this.setState({
      focusIndex: -1
    });
  }

  move(event) {

    // hach around issue where ref defined here but created
    // in another component isn't registered as a ref on THIS
    // component. Works though...
    if (event.keyCode === 40) {
      this.refs.menu.refs.select.focus();
    }
  }

  onItemSelect(value) {

    // reset the selected value
    this._selectedValue = value;
    this.props.reference.setValue(value);
    this.refs.menu.hide();
  }

  onItemHover(value) {
    this.props.reference.setValue(value);
  }

  onMenuShow() {

    // preserved current value so that we can preview other fonts
    this._selectedValue = this.props.reference.getValue();
    this.setState({
      focusIndex: -1,
      filter: void 0
    });
  }

  onMenuHide() {

    // revert preview changes
    this.props.reference.setValue(this._selectedValue);
  }

  getItemIndex() {
    return this.props.items.findIndex((item) => {
      return this.getItemValue(item) === this.props.reference.getValue();
    });
  }

  getItemValue(item) {
    return this.props.valueProperty ? item[this.props.valueProperty] : item;
  }

  onPositionChange(position) {
    this.setState({
      focusIndex: position
    });
  }

  render() {

    var selectedItemIndex = this.getItemIndex();
    var createLabel       = typeof this.props.labelProperty === 'function' ? this.props.labelProperty : (item) => {
      return item[this.props.labelProperty];
  };

    var createDefaultLabel  = coerceFunction(this.props.defaultLabel || 'Select an item');

    var createMenu = () => {

      if (this.props.showSearch) {
        var searchInputSection = <div className='m-search-dropdown--header'><FocusComponent focus={this.state.focusIndex === -1}>
          <input ref='input' type='text' className='form-control' onInput={this.setFilter.bind(this)} onFocus={this.onInputFocus.bind(this)}></input>
        </FocusComponent></div>;
      }

      return <div className='m-search-dropdown--inner'>
        {searchInputSection}
         <SelectComponent
           ref='select'
           {...this.props}
           onSelect={this.onItemSelect.bind(this)}
           onItemHover={this.onItemHover.bind(this)}
           filter={this.state.filter}
           items={this.props.items}
           onPositionChange={this.onPositionChange.bind(this)} />
      </div>
    };

    var classNames = cx({
      'm-search-dropdown' : true,
      'disable'           : this.props.disable
    });

    return <MenuComponent
      ref='menu'
      {...this.props}
      onMenuShow={this.onMenuShow.bind(this)}
      onMenuHide={this.onMenuHide.bind(this)}
      onKeyDown={this.move.bind(this)}
      className={[classNames, this.props.className].join(' ')}
      createMenu={createMenu}>

      <span ref='label' className='input m-search-dropdown--label'>{
        ~selectedItemIndex ? createLabel(this.props.items[selectedItemIndex]) : createDefaultLabel()
      }</span>

    </MenuComponent>
  }
}

SearchDropdownComponent.defaultProps = {
  labelProperty : 'label',
  valueProperty : 'value',
  showSearch    : true
};

export default SearchDropdownComponent;
