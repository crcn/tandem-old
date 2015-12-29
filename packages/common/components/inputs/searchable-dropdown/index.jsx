import './index.scss';

import cx from 'classnames';
import React from 'react';
import MenuComponent from 'common/components/menu';
import SelectComponent from 'common/components/inputs/select';
import PortalComponent from 'common/components/portal';
import PopdownComponent from 'common/components/popdown';
import { coerceFunction } from 'common/utils/function';

/**
 * Similar to a dropmenu, but aso has search capabilities
 */

class SearchDropdownComponent extends React.Component {

  setFilter(event) {
    function defaultCreateFilter(search) {
      search = search.toLowerCase();
      return function(option) {
        // scan all props
        for (var key in option) {
          var value = option[key];
          if (!!~String(value).toLowerCase().indexOf(search)) return true;
        }
      };
    }
    
    this.setState({
      filter: defaultCreateFilter(event.target.value)
    });
  }

  move(event) {

    // hach around issue where ref defined here but created
    // in another component isn't registered as a ref on THIS
    // component. Works though...
    if (event.keyCode === 40) {
      event.preventDefault();
      event.stopPropagation();
      this.refs.menu.refs.select.focus();
    }
  }

  onOptionSelect(value) {

    // reset the selected value
    this._selectedValue = value;
    this.props.reference.setValue(value);
    this.refs.menu.hide();
  }

  onOptionHover(value) {
    this.props.reference.setValue(value);
  }

  onMenuShow() {

    // preserved current value so that we can preview other fonts
    this._selectedValue = this.props.reference.getValue();

    this._focusOnInput(-1);
    this.setState({
      filter: function() {
        return true;
      }
    });
  }

  onMenuHide() {

    // revert preview changes
    this.props.reference.setValue(this._selectedValue);
  }

  getOptionIndex() {
    return this.props.options.findIndex((option) => {
      return this.getOptionValue(option) === this.props.reference.getValue();
    });
  }

  getOptionValue(option) {
    return this.props.valueProperty ? option[this.props.valueProperty] : option;
  }

  onPositionChange(position) {
    this._focusOnInput(position);
  }

  _focusOnInput(position) {
    if (position === -1) {
      setTimeout(() => {
        this.refs.menu.refs.input.focus();
      }, 50);
    }
  }

  render() {

    var selectedOptionIndex = this.getOptionIndex();
    var createLabel       = typeof this.props.labelProperty === 'function' ? this.props.labelProperty : (option) => {
      return option[this.props.labelProperty];
  };

    var createDefaultLabel  = coerceFunction(this.props.defaultLabel || 'Select an option');

    var createMenu = () => {

      if (this.props.showSearch) {
        var searchInputSection = <div className='m-search-dropdown--header'>
          <input ref='input' type='text' className='form-control' onInput={this.setFilter.bind(this)}></input>
        </div>;
      }

      return <div className='m-search-dropdown--inner'>
        {searchInputSection}
         <SelectComponent
           ref='select'
           {...this.props}
           onSelect={this.onOptionSelect.bind(this)}
           onOptionHover={this.onOptionHover.bind(this)}
           filter={this.state.filter}
           options={this.props.options}
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

      <span ref='label' className='m-search-dropdown--label'>{
        ~selectedOptionIndex ? createLabel(this.props.options[selectedOptionIndex]) : createDefaultLabel()
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
