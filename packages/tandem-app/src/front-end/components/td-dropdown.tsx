import * as React from "React";
import { hydrateTdSelectMenu, TdSelectMenuInnerProps } from "./td-select-menu.pc";
import { compose, pure, withHandlers } from "recompose";

export type DropdownMenuOption = {
  label: string;
  value: any;
}

export type DropdownMenuOuterProps = {
  options: DropdownMenuOption[];
};

export type DropdownMenuInnerProps = {
  onOptionSelected: () => any;
} & DropdownMenuOuterProps & TdSelectMenuInnerProps;

export const DropdownMenu = hydrateTdSelectMenu(compose<DropdownMenuInnerProps, DropdownMenuOuterProps>(
  pure,
  withHandlers({
    onOptionSelected: ({ }) => (option) => {
      console.log("ITEM", option);
    }
  }),
  ({ options, onOptionSelected }: DropdownMenuInnerProps) => (Base: React.ComponentClass<TdSelectMenuInnerProps>) => {
    const items = options.map(option => ({
      ...option,
      onClick: onOptionSelected.bind(this, option)
    }))
    return <Base items={items} />
  }
), {
  TdList: null,
  TdListItem: null
});

export type DropdownButtonOuterProps = {
  children?: any;
  options: DropdownMenuOuterProps;
};

export type DropdownButtonInnerProps = {
  open?: boolean;
} & DropdownButtonOuterProps;

export const DropdownButton = compose<DropdownButtonInnerProps, DropdownButtonOuterProps>(
  pure
)(({children, open}: DropdownButtonInnerProps) => {
  return <span>
    <span>
      {children}
    </span>
    <span>
    </span>
  </span>;
});