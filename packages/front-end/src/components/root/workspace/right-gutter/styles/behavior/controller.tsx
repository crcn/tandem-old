import * as React from "react";
import { Dispatch } from "redux";
import { BaseStyleBehaviorTabProps } from "./view.pc";
import { PCVariantTrigger, PCVariant } from "paperclip";

export type Props = {
  dispatch: Dispatch<any>;
  variantTriggers: PCVariantTrigger[];
  variants: PCVariant[];
};

export default (Base: React.ComponentClass<BaseStyleBehaviorTabProps>) =>
  class StyleBehaviorController extends React.PureComponent<Props> {
    render() {
      const { dispatch, variantTriggers, variants, ...rest } = this.props;
      return (
        <Base
          {...rest}
          triggersPaneProps={{
            variantTriggers,
            variants,
            dispatch
          }}
        />
      );
    }
  };
