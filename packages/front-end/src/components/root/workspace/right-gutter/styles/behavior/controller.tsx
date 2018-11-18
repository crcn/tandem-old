import * as React from "react";
import { Dispatch } from "redux";
import { BaseStyleBehaviorTabProps } from "./view.pc";
import { PCVariantTrigger, PCVariant, PCMediaQuery } from "paperclip";

export type Props = {
  dispatch: Dispatch<any>;
  variantTriggers: PCVariantTrigger[];
  variants: PCVariant[];
  globalMediaQueries: PCMediaQuery[];
};

export default (Base: React.ComponentClass<BaseStyleBehaviorTabProps>) =>
  class StyleBehaviorController extends React.PureComponent<Props> {
    render() {
      const {
        globalMediaQueries,
        dispatch,
        variantTriggers,
        variants,
        ...rest
      } = this.props;
      return (
        <Base
          {...rest}
          triggersPaneProps={{
            variantTriggers,
            globalMediaQueries,
            variants,
            dispatch
          }}
        />
      );
    }
  };
