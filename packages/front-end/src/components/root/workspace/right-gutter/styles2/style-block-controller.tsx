import * as React from "react";
import { BaseStyleBlockProps } from "./view.pc";

export type Props = {};

export default (Base: React.ComponentClass<BaseStyleBlockProps>) => {
  return class StyleBlock extends React.Component<Props> {
    render() {
      return (
        <Base
          addPropertyDropdownProps={{
            open: false,
            onShouldClose: () => {}
          }}
        />
      );
    }
  };
};
