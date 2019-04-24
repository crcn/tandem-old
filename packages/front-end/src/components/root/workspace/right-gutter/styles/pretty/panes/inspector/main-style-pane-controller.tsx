import * as React from "react";
import { BaseMainStylePaneProps } from "./view.pc";
import { ComputedStyleInfo } from "paperclip";
import { Dispatch } from "redux";

export type Props = {
  computedStyleInfo: ComputedStyleInfo;
  dispatch: Dispatch;
};

export default (Base: React.ComponentClass<BaseMainStylePaneProps>) => {
  return class MainStylePaneController extends React.PureComponent<Props> {
    render() {
      const { computedStyleInfo, dispatch } = this.props;
      return (
        <Base styleTableProps={{ style: computedStyleInfo.style, dispatch }} />
      );
    }
  };
};
