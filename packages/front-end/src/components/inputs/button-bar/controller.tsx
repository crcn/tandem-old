import * as React from "react";
import { compose, pure } from "recompose";
const { ButtonBarItem: ButtonBarItemComponent } = require("./item.pc");

export type ButtonBarOption = {
  iconSrc: string;
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
        iconProps={{ src: item.iconSrc }}
        style={style}
        onClick={onChange && (() => onChange(item.value))}
      />
    );
  });

  return <Base children={children} />;
});
