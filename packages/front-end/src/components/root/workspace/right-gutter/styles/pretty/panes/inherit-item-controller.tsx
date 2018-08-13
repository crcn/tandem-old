import * as React from "react";
import * as cx from "classnames";
import { compose, pure, withHandlers } from "recompose";
import { PCComponent } from "paperclip";
import { DropdownMenuOption } from "../../../../../../inputs/dropdown/controller";
import { memoize } from "tandem-common";
import {
  inheritItemComponentTypeChangeComplete,
  inheritItemClick
} from "actions";
import { Dispatch } from "redux";

export type InheritItemControllerOuterProps = {
  dispatch: Dispatch<any>;
  componentId: string;
  component: PCComponent;
  selected?: boolean;
  allComponents: PCComponent[];
};

export type InheritItemControllerInnerProps = {
  onChangeComplete: any;
  onClick: any;
} & InheritItemControllerOuterProps;

export default compose(
  pure,
  withHandlers({
    onChangeComplete: ({
      dispatch,
      componentId
    }: InheritItemControllerOuterProps) => value => {
      dispatch(inheritItemComponentTypeChangeComplete(componentId, value.id));
    },
    onClick: ({ dispatch, componentId }) => () => {
      dispatch(inheritItemClick(componentId));
    }
  }),
  Base => ({
    component,
    allComponents,
    selected,
    onChangeComplete,
    onClick
  }: InheritItemControllerInnerProps) => {
    return (
      <Base
        onClick={onClick}
        variant={cx({ selected })}
        dropdownProps={{
          onClick: event => event.stopPropagation(),
          filterable: true,
          value: component,
          options: getComponentOptions(allComponents),
          onChangeComplete: onChangeComplete
        }}
      />
    );
  }
);

const getComponentOptions = memoize(
  (components: PCComponent[]): DropdownMenuOption[] => {
    return components
      .map(component => {
        return {
          label: component.label,
          value: component
        };
      })
      .sort((a, b) => (a.label > b.label ? -1 : 1));
  }
);
