import * as React from "react";
import { compose, pure } from "recompose";
import { BaseComponentOptionProps } from "./cell.pc";

export type Props = BaseComponentOptionProps;

export default compose<BaseComponentOptionProps, Props>(
  pure,
  (Base: React.ComponentClass<BaseComponentOptionProps>) => props => {
    return <Base {...props} />;
  }
);
