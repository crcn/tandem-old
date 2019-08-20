import * as React from "react";
import { BaseStyleBlockProps } from "./view.pc";
import { ComputedStyleBlock } from "paperclip";

export type Props = {
  styleBlock: ComputedStyleBlock;
};

export default (Base: React.ComponentClass<BaseStyleBlockProps>) => {
  return class StyleBlock extends React.Component<Props> {
    render() {
      const { styleBlock } = this.props;
      return (
        <Base
          addPropertyDropdownProps={{
            open: false,
            onShouldClose: () => {}
          }}
          propertiesListProps={{
            items: styleBlock.properties
          }}
        />
      );
    }
  };
};
