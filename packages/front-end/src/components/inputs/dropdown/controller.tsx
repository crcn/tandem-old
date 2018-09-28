import * as React from "react";
import * as cx from "classnames";
import { DropdownMenuItem } from "./menu.pc";
import { EMPTY_ARRAY, memoize } from "tandem-common";
import { BaseDropdownProps } from "./view.pc";
import { PCVariable } from "paperclip";

export type DropdownMenuOption = {
  label: string;
  value: any;
  special?: boolean;
};

export const NO_OPTION: DropdownMenuOption = {
  label: "--",
  value: undefined
};

export const dropdownMenuOptionFromValue = (
  value: string
): DropdownMenuOption => ({ label: value || "--", value });

export const mapVariablesToDropdownOptions = memoize(
  (variables: PCVariable[]): DropdownMenuOption[] => {
    return variables.map(variable => ({
      value: variable,
      label: variable.label,
      special: true
    }));
  }
);

export type Props = BaseDropdownProps & {
  value?: any;
  filterable?: boolean;
  options: DropdownMenuOption[];
  onChange?: (value: any) => any;
  onChangeComplete?: (value: any) => any;
};

type DropdownState = {
  open: boolean;
  filter: string;
};

export default (Base: React.ComponentClass<BaseDropdownProps>) => {
  return class DropdownController extends React.PureComponent<
    Props,
    DropdownState
  > {
    constructor(props) {
      super(props);
      this.state = {
        open: false,
        filter: null
      };
    }
    onClick = event => {
      this.setState({ ...this.state, open: !this.state.open });
      if (this.props.onClick) {
        this.props.onClick(event);
      }
    };
    onFilterChange = value => {
      this.setState({ ...this.state, filter: value });
    };
    componentWillUpdate(props) {
      if (this.props.value !== props.value && this.state.filter) {
        this.setState({ ...this.state, filter: null });
      }
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
    };
    onKeyDown = event => {
      if (event.key === "Enter") {
        this.setState({ ...this.state, open: true });
      }
    };
    onShouldClose = () => {
      this.setState({ ...this.state, open: false });
    };

    render() {
      const {
        value,
        options = EMPTY_ARRAY,
        filterable,
        onClick,
        onChange,
        onChangeComplete,
        ...rest
      } = this.props;
      const { open, filter } = this.state;

      const menuItems = open
        ? options
            .filter(
              ({ label }) =>
                !filter || label.toLowerCase().indexOf(filter) !== -1
            )
            .map((item, i) => {
              return (
                <DropdownMenuItem
                  key={i}
                  variant={cx({
                    alt: Boolean(i % 2),
                    special: item.special
                  })}
                  onClick={event => this.onItemClick(item, event)}
                >
                  {item.label}
                </DropdownMenuItem>
              );
            })
        : EMPTY_ARRAY;

      const selectedItem: DropdownMenuOption = options.find(
        item => item.value === value
      );
      const showFilter = open && filterable;

      return (
        <Base
          variant={cx({
            special: selectedItem && selectedItem.special
          })}
          popoverProps={{
            open,
            onShouldClose: this.onShouldClose
          }}
          filterInputProps={{
            style: {
              display: showFilter ? "block" : "none"
            } as any,
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
      );
    }
  };
};
