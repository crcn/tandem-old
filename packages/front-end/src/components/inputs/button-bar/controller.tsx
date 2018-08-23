import * as React from "react";
import * as cx from "classnames";
import { EMPTY_ARRAY } from "tandem-common";
import { compose, pure } from "recompose";
import { BaseButtonBarProps } from "./view.pc";
const { ButtonBarItem: ButtonBarItemComponent } = require("./item.pc");

export type ButtonBarOption = {
  icon: any;
  value: any;
};

export type Props = {
  options: ButtonBarOption[];
  value: any;
  onChange: any;
};

export default compose<BaseButtonBarProps, Props>(
  pure,
  (Base: React.ComponentClass<BaseButtonBarProps>) => ({
    options,
    value,
    onChange
  }) => {
    const children = (options || EMPTY_ARRAY).map((item, i) => {
      return (
        <ButtonBarItemComponent
          key={item.iconSrc}
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
);
