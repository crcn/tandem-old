import * as React from "react";
import { compose, pure, withHandlers, withState } from "recompose";
import { Dispatch } from "redux";
import { RootState } from "../../state";
const { ComponentOption } = require("./cell.pc");
import { getAllPCComponents } from "paperclip";
import { componentPickerItemClick } from "../../actions";

export type ComponentPickerOuterProps = {
  root: RootState;
  dispatch: Dispatch<any>;
};

type ComponentPickerInnerProps = {
  filter: string[];
  onClickComponent: any;
  onFilterChange: any;
} & ComponentPickerOuterProps;

export default compose<ComponentPickerInnerProps, ComponentPickerOuterProps>(
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
  Base => ({
    onFilterChange,
    onClickComponent,
    filter,
    root,
    dispatch
  }: ComponentPickerInnerProps) => {
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
