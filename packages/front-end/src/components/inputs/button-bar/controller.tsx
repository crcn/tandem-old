import * as React from "react";
import { compose, pure } from "recompose";
const { ButtonBarItem: ButtonBarItemComponent } = require("./item.pc");

export type ButtonBarOption = {
  icon: any;
  value: any;
};

export default compose(pure, Base => ({ options, value, onChange }) => {
  const children = options.map((item, i) => {
    let style;
    if (item.value === value) {
      style = { background: "#00B5FF" };
    }

    return (
      <ButtonBarItemComponent
        key={item.iconSrc}
        children={item.icon}
        style={style}
        onClick={onChange && (() => onChange(item.value))}
      />
    );
  });

  return <Base children={children} />;
});
