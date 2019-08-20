import * as React from "react";
import { BaseStylesSectionProps, StyleBlock } from "./view.pc";
import { ComputedStyleBlock } from "paperclip";

export type Props = {
  computedStyleBlocks: ComputedStyleBlock[];
};

export default (Base: React.ComponentClass<BaseStylesSectionProps>) => {
  class StylesSection extends React.Component<Props> {
    render() {
      const { computedStyleBlocks } = this.props;
      const styleBlocks = computedStyleBlocks.map((styleBlock, i) => {
        return <StyleBlock styleBlock={styleBlock} />;
      });

      return <Base content={styleBlocks} />;
    }
  }

  return StylesSection;
};
