import * as React from "react";
import * as cx from "classnames";
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

export default (Base: React.ComponentClass<BaseInheritItemProps>) =>
  class InheritItemController extends React.PureComponent<Props> {
    onChangeComplete = value => {
      this.props.dispatch(
        inheritItemComponentTypeChangeComplete(this.props.componentId, value.id)
      );
    };
    onClick = () => {
      this.props.onClick(this.props.componentId);
    };
    render() {
      const { onClick, onChangeComplete } = this;
      const { selected, component, allComponents } = this.props;

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
  };

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
