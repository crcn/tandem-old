import * as React from "react";
import { findDOMNode } from "react-dom";
import { hydrateTdDropdownButton, hydrateTdDropdownMenu, TdDropdownButtonInnerProps, TdDropdownMenuInnerProps } from "./td-dropdown.pc";
import { compose, pure, withHandlers, withState, lifecycle } from "recompose";

export type DropdownMenuOption = {
  label: string;
  value: any;
};

export type DropdownMenuOuterProps = {
  options: DropdownMenuOption[];
  onOptionSelected: () => any;
};

export type DropdownMenuInnerProps = DropdownMenuOuterProps & TdDropdownMenuInnerProps;

export const DropdownMenu = hydrateTdDropdownMenu(compose<DropdownMenuInnerProps, DropdownMenuOuterProps>(
  pure,
  (Base: React.ComponentClass<TdDropdownMenuInnerProps>) => ({ options, onOptionSelected, dispatch, ...rest }: DropdownMenuInnerProps) => {
    const optionProps = options.map(option => ({
      ...option,
      dispatch,
      onClick: onOptionSelected && onOptionSelected.bind(this, option)
    }))
    return <Base options={optionProps} {...rest} />
  }
), {
  TdList: null,
  TdListItem: null
});

export type DropdownButtonOuterProps = {
  children?: any;
  onOptionSelected?: (option: DropdownMenuOption) => any;
  options: DropdownMenuOption[];
  open: any;
  right: boolean;
  className: string;
};

export type DropdownButtonInnerProps = {
} & DropdownButtonOuterProps & TdDropdownButtonInnerProps;

export const DropdownButton = hydrateTdDropdownButton(compose<DropdownButtonInnerProps, DropdownButtonOuterProps>(
  pure,
  withState("open", "setOpen", false),
  withHandlers({
    onButtonClick: ({ open, setOpen }) => () => {
      setOpen(!open);
    },
    onOptionSelected: ({ onOptionSelected, setOpen }) => (option) => {
      if (onOptionSelected) {
        onOptionSelected(option);
      }
      setOpen(false);
    }
  }),
  lifecycle({
    componentDidUpdate() {
      const {open, setOpen} = this.props as DropdownButtonInnerProps;
      if (open) {
        const onDocumentMouseDown = (event) => {
          if (!findDOMNode(this as any).contains(event.target)) {
            setOpen(false);
            document.removeEventListener("mousedown", onDocumentMouseDown);  
          }
        };
        document.addEventListener("mousedown", onDocumentMouseDown);
      }
    }
  }),
  (Base: React.ComponentClass<TdDropdownButtonInnerProps>) => ({ open, options, children, onOptionSelected, onButtonClick, ...rest }: DropdownButtonInnerProps) => {
    return <Base open={open} options={options} onButtonClick={onButtonClick} onOptionSelected={onOptionSelected} {...rest}>
      {children}
    </Base>;
  }
), {
  TdDropdownMenu: DropdownMenu
});