import * as React from "react";
import * as cx from "classnames";
import { compose, pure, withHandlers } from "recompose";
import { PCComponent } from "paperclip";
import { DropdownMenuOption } from "../../../../../../inputs/dropdown/controller";
import { memoize } from "tandem-common";
import { inheritItemComponentTypeChangeComplete } from "../../../../../../../actions";
import { Dispatch } from "redux";
import { BaseInheritItemProps } from "./inherit-item.pc";

export type Props = {
  onClick: any;
  dispatch: Dispatch<any>;
  componentId: string;
  component: PCComponent;
  selected?: boolean;
  allComponents: PCComponent[];
};

export type InnerProps = {
  onChangeComplete: any;
  onClick: any;
} & Props;

export default compose<InnerProps, Props>(
  pure,
  withHandlers({
    onChangeComplete: ({ dispatch, componentId }: InnerProps) => value => {
      dispatch(inheritItemComponentTypeChangeComplete(componentId, value.id));
    },
    onClick: ({ onClick, componentId }) => () => {
      onClick(componentId);
    }
  }),
  (Base: React.ComponentClass<BaseInheritItemProps>) => ({
    component,
    allComponents,
    selected,
    onChangeComplete,
    onClick
  }: InnerProps) => {
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
