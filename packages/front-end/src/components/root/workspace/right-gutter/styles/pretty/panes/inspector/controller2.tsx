import { BaseStyleInspector2Props } from "./view.pc";
import * as React from "react";
import { ComputedStyleInfo } from "paperclip";
import { Dispatch } from "redux";

export type Props = {
  computedStyleInfo: ComputedStyleInfo;
  dispatch: Dispatch;
};

export default (Base: React.ComponentClass<BaseStyleInspector2Props>) => {
  return class StyleInspector2Controller extends React.PureComponent<Props> {
    render() {
      const { computedStyleInfo, dispatch } = this.props;
      return <Base mainStylePaneProps={{ computedStyleInfo, dispatch }} />;
    }
  };
};
