import * as React from "react";
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
  options: DropdownMenuOption[];
  onChange?: (item: DropdownMenuOption) => any;
};

export default compose(
  pure,
  withState("open", "setOpen", false),
  withHandlers({
    onClick: ({ open, setOpen }) => () => {
      setOpen(!open);
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
    onItemClick,
    ...rest
  }) => {
    const menuItems = open
      ? options.map((item, i) => {
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

    return (
      <Base
        popoverProps={{
          open
        }}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        menuProps={{ children: menuItems }}
        labelProps={{ text: (selectedItem && selectedItem.label) || "--" }}
        {...rest}
      />
    );
  }
);
