import * as React from "react";
import { compose, pure, withHandlers, withState } from "recompose";
import { Dispatch } from "redux";
import { RootState } from "../../state";
import { ComponentOption } from "./cell.pc";
import { getAllPCComponents } from "paperclip";
import { componentPickerItemClick } from "../../actions";
import { BasePickerProps } from "./picker.pc";

export type Props = {
  root: RootState;
  dispatch: Dispatch<any>;
};

type InnerProps = {
  filter: string[];
  onClickComponent: any;
  onFilterChange: any;
} & Props;

export default compose<BasePickerProps, Props>(
  pure,
  withState("filter", "setFilter", []),
  withHandlers({
    onFilterChange: ({ setFilter }) => value => {
      setFilter((value || "").split(" "));
    },
    onClickComponent: ({ dispatch }) => component => {
      dispatch(componentPickerItemClick(component));
    }
  }),
  (Base: React.ComponentClass<BasePickerProps>) => ({
    onFilterChange,
    onClickComponent,
    filter,
    root
  }: InnerProps) => {
    const componentNodes = getAllPCComponents(root.graph);

    // TODO - filter private
    const options = componentNodes
      .filter(component => {
        const label = (component.label || "").toLowerCase();
        for (const part of filter) {
          if (label.indexOf(part) === -1) {
            return false;
          }
        }

        return true;
      })
      .map(component => {
        return (
          <ComponentOption
            key={component.id}
            component={component}
            onClick={() => onClickComponent(component)}
            centerProps={{ children: component.label }}
          />
        );
      });

    return (
      <Base
        filterInputProps={{
          onChange: onFilterChange
        }}
        optionsProps={{ children: options }}
      />
    );
  }
);
