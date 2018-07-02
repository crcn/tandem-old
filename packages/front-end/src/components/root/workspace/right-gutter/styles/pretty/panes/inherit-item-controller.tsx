import * as React from "react";
import { compose, pure, withHandlers } from "recompose";
import { PCComponent } from "paperclip";
import { DropdownMenuOption } from "../../../../../../inputs/dropdown/controller";
import { memoize } from "tandem-common";
import { inheritItemComponentTypeChangeComplete } from "actions";
import { Dispatch } from "react-redux";

export type InheritItemControllerOuterProps = {
  dispatch: Dispatch<any>;
  componentId: string;
  component: PCComponent;
  allComponents: PCComponent[];
};

export type InheritItemControllerInnerProps = {
  onChangeComplete: any;
} & InheritItemControllerOuterProps;

export default compose(
  pure,
  withHandlers({
    onChangeComplete: ({ dispatch, componentId }: InheritItemControllerOuterProps) => (value) => {
      dispatch(inheritItemComponentTypeChangeComplete(componentId, value.id));
    },
  }),
  Base => ({ component, allComponents, onChangeComplete }: InheritItemControllerInnerProps) => {
    return <Base dropdownProps={{
      filterable: true,
      value: component,
      options: getComponentOptions(allComponents),
      onChangeComplete: onChangeComplete
    }} />
  }
);

const getComponentOptions = memoize((components: PCComponent[]): DropdownMenuOption[] => {
  return components.map(component => {
    return {
      label: component.label,
      value: component
    };
  }).sort((a, b) => a.label > b.label ? -1 : 1);
});