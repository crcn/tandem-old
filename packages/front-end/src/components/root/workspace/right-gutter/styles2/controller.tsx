import * as React from "react";
import { BaseStylesSectionProps, StylesSection, StyleBlock } from "./view.pc";

export type Props = {};

export default (Base: React.ComponentClass<BaseStylesSectionProps>) => {
  class StylesSection extends React.Component<Props> {
    render() {
      console.log("SECTION");

      const styleBlocks = [<StyleBlock />, <StyleBlock />];

      return <Base content={styleBlocks} />;
    }
  }

  return StylesSection;
};
