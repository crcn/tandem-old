import * as React from "react";
import { SyntheticElement, PCVariable } from "paperclip";
import { Dispatch } from "redux";
import { BaseInnerShadowsProps } from "./box-shadows.pc";
import { ComputedStyleInfo } from "../../state";

export type Props = {
  globalVariables: PCVariable[];
  value?: string;
  dispatch: Dispatch<any>;
  computedStyleInfo: ComputedStyleInfo;
};

export default (Base: React.ComponentClass<BaseInnerShadowsProps>) => (
  props: Props
) => {
  return <Base {...props} inset />;
};
