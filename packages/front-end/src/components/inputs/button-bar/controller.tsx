import * as React from "react";
import * as cx from "classnames";
import { EMPTY_ARRAY } from "tandem-common";
import { BaseButtonBarProps } from "./view.pc";
import { ButtonBarItem as ButtonBarItemComponent } from "./item.pc";

export type ButtonBarOption = {
  icon: any;
  value: any;
};

export type Props = {
  options: ButtonBarOption[];
  value: any;
  onChange: any;
};

export default (Base: React.ComponentClass<BaseButtonBarProps>) =>
  class ButtonBarController extends React.PureComponent<Props> {
    render() {
      const { options, value, onChange } = this.props;
      const children = (options || EMPTY_ARRAY).map((item, i) => {
        return (
          <ButtonBarItemComponent
            key={i}
            children={item.icon}
            variant={cx({
              selected: item.value === value,
              last: i === options.length - 1
            })}
            onClick={onChange && (() => onChange(item.value))}
          />
        );
      });

      return <Base children={children} />;
    }
  };
