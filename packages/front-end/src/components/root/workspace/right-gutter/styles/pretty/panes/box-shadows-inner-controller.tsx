import * as React from "react";
import { SyntheticElement } from "paperclip";
import { Dispatch } from "redux";
import { BaseInnerShadowsProps } from "./box-shadows.pc";

export type Props = {
  value?: string;
  dispatch: Dispatch<any>;
  selectedNodes: SyntheticElement[];
};

export default (Base: React.ComponentClass<BaseInnerShadowsProps>) => (
  props: Props
) => {
  return <Base {...props} inset />;
};
