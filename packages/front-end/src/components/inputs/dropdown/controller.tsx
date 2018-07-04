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
};

export default compose(
  pure,
  withState("open", "setOpen", false),
  withState("filter", "setFilter", null),
  withHandlers({
    onClick: ({ open, setOpen }) => () => {
      setOpen(!open);
    },
    onFilterChange: ({ setFilter }) => value => {
      setFilter(value && value.toLowerCase());
    },
    onItemClick: ({ onChange, onChangeComplete, setOpen }) => (item, event) => {
      if (onChange) {
        onChange(item.value);
      }
      if (onChangeComplete) {
        onChangeComplete(item.value);
      }
      setOpen(false);
    },
    onKeyDown: ({ setOpen }) => event => {
      if (event.key === "Enter") {
        setOpen(true);
      }
    },
    onBlur: ({ setOpen }) => () => {
      // setOpen(false);
    }
  }),
  Base => ({
    value,
    options = EMPTY_ARRAY,
    open,
    onKeyDown,
    onBlur,
    filter,
    filterable,
    onFilterChange,
    onItemClick,
    ...rest
  }) => {
    const menuItems = open
      ? options
          .filter(
            ({ label }) => !filter || label.toLowerCase().indexOf(filter) !== -1
          )
          .map((item, i) => {
            return (
              <DropdownMenuItem
                key={i}
                onClick={event => onItemClick(item, event)}
              >
                {item.label}
              </DropdownMenuItem>
            );
          })
      : EMPTY_ARRAY;

    const selectedItem = options.find(item => item.value === value);
    const showFilter = open && filterable;

    return (
      <Base
        popoverProps={{
          open
        }}
        filterInputProps={{
          style: {
            display: showFilter ? "block" : "none"
          },
          value: selectedItem && selectedItem.label,
          focus: showFilter,
          onChange: onFilterChange
        }}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        menuProps={{ children: menuItems }}
        labelProps={{
          style: {
            display: showFilter ? "none" : "block"
          },
          text: (selectedItem && selectedItem.label) || "--"
        }}
        {...rest}
      />
    );
  }
);
