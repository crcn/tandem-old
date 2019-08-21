import * as React from "react";
import { BaseStylesSectionProps, StyleBlock } from "./view.pc";
import { ComputedStyleBlock } from "paperclip";
import { Dispatch } from "redux";

export type Props = {
  computedStyleBlocks: ComputedStyleBlock[];
  dispatch: Dispatch;
};

export default (Base: React.ComponentClass<BaseStylesSectionProps>) => {
  class StylesSection extends React.Component<Props> {
    render() {
      const { computedStyleBlocks, dispatch } = this.props;
      const styleBlocks = computedStyleBlocks.map((styleBlock, i) => {
        return <StyleBlock styleBlock={styleBlock} dispatch={dispatch} />;
      });

      return <Base content={styleBlocks} />;
    }
  }

  return StylesSection;
};
