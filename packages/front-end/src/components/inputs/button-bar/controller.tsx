import * as React from "react";
import * as cx from "classnames";
import { EMPTY_ARRAY } from "tandem-common";
import { compose, pure } from "recompose";
const { ButtonBarItem: ButtonBarItemComponent } = require("./item.pc");

export type ButtonBarOption = {
  icon: any;
  value: any;
};

export default compose(
  pure,
  Base => ({ options, value, onChange }) => {
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
