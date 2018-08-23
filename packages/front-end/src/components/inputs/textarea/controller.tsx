import * as React from "react";
import { compose, pure } from "recompose";
import { withInputHandlers, WithInputHandlersProps } from "../text/controller";
import { BaseTextareaProps } from "./view.pc";

export type Props = WithInputHandlersProps;

export default compose<BaseTextareaProps, Props>(
  pure,
  withInputHandlers(),
  (Base: React.ComponentClass<BaseTextareaProps>) => ({ value, onKeyDown }) => {
    return <Base defaultValue={value} onKeyDown={onKeyDown} />;
  }
);
