import * as React from "react";
import * as cx from "classnames";
import { PCComponent, PCStyleMixin } from "paperclip";
import { DropdownMenuOption } from "../../../../../../inputs/dropdown/controller";
import { memoize } from "tandem-common";
import { inheritItemComponentTypeChangeComplete } from "../../../../../../../actions";
import { Dispatch } from "redux";
import { BaseInheritItemProps } from "./inherit-item.pc";

export type Props = {
  onClick: any;
  dispatch: Dispatch<any>;
  styleMixinId: string;
  styleMixin: PCStyleMixin;
  selected?: boolean;
  allStyleMixins: PCStyleMixin[];
};

export default (Base: React.ComponentClass<BaseInheritItemProps>) =>
  class InheritItemController extends React.PureComponent<Props> {
    onChangeComplete = value => {
      this.props.dispatch(
        inheritItemComponentTypeChangeComplete(
          this.props.styleMixinId,
          value.id
        )
      );
    };
    onClick = () => {
      this.props.onClick(this.props.styleMixinId);
    };
    render() {
      const { onClick, onChangeComplete } = this;
      const { selected, styleMixin, allStyleMixins } = this.props;

      return (
        <Base
          onClick={onClick}
          variant={cx({ selected })}
          dropdownProps={{
            onClick: event => event.stopPropagation(),
            filterable: true,
            value: styleMixin,
            options: getStyleMixinOptions(allStyleMixins),
            onChangeComplete: onChangeComplete
          }}
        />
      );
    }
  };

const getStyleMixinOptions = memoize(
  (styleMixins: PCStyleMixin[]): DropdownMenuOption[] => {
    return styleMixins
      .map(styleMixin => {
        return {
          label: styleMixin.label,
          value: styleMixin
        };
      })
      .sort((a, b) => (a.label > b.label ? -1 : 1));
  }
);
