import * as React from "react";
import * as cx from "classnames";
import { compose, pure, withHandlers, withState } from "recompose";
const { DropdownMenuItem } = require("./menu.pc");
import { EMPTY_ARRAY } from "tandem-common";

export type DropdownMenuOption = {
  label: string;
  value: any;
};

export const dropdownMenuOptionFromValue = (
  value: string
): DropdownMenuOption => ({ label: value || "--", value });

export type DropdownOuterProps = {
  value?: string;
  filterable?: boolean;
  options: DropdownMenuOption[];
  onChange?: (item: DropdownMenuOption) => any;
  onChangeComplete?: (item: DropdownMenuOption) => any;
};

type DropdownState = {
  open: boolean;
  filter: string;
}

export default (Base) => {
  return class DropdownController extends React.PureComponent<DropdownOuterProps, DropdownState> {
    constructor(props) {
      super(props);
      this.state = {
        open: false,
        filter: null
      };
    }
    onClick = () => {
      this.setState({ ...this.state, open: !this.state.open });
    }
    onFilterChange = (value) => {
      this.setState({ ...this.state, filter: value });
    }
    onItemClick = (item, event) => {
      const { onChange, onChangeComplete } = this.props;
      if (onChange) {
        onChange(item.value);
      }
      if (onChangeComplete) {
        onChangeComplete(item.value);
      }
      this.setState({ ...this.state, open: false });
    }
    onKeyDown = (event) => {
      if (event.key === "Enter") {
        this.setState({ ...this.state, open: true });
      }
    }
    onShouldClose = () => {
      this.setState({ ...this.state, open: false });
    }

    render() {
      const {
        value,
        options = EMPTY_ARRAY,
        filterable,
        ...rest
      } = this.props;
      const {
        open,
        filter
      } = this.state;


        const menuItems = open
        ? options
            .filter(
              ({ label }) => !filter || label.toLowerCase().indexOf(filter) !== -1
            )
            .map((item, i) => {
              return (
                <DropdownMenuItem
                  key={i}
                  onClick={event => this.onItemClick(item, event)}
                >
                  {item.label}
                </DropdownMenuItem>
              );
            })
        : EMPTY_ARRAY;

      const selectedItem = options.find(item => item.value === value);
      const showFilter = open && filterable;

      return <Base
      popoverProps={{
        open,
        onShouldClose: this.onShouldClose
      }}
      filterInputProps={{
        style: {
          display: showFilter ? "block" : "none"
        },
        value: selectedItem && selectedItem.label,
        focus: showFilter,
        onChange: this.onFilterChange
      }}
      tabIndex={0}
      onKeyDown={this.onKeyDown}
      options={menuItems}
      labelProps={{
        style: {
          display: showFilter ? "none" : "block"
        },
        text: (selectedItem && selectedItem.label) || "--"
      }}
      onClick={this.onClick}
      {...rest}
    />
    }
  }
}
