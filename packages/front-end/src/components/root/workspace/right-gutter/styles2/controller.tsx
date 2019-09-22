import * as React from "react";
import { BaseStylesSectionProps, StyleBlock } from "./view.pc";
import { ComputedStyleBlock } from "paperclip";
import { Dispatch } from "redux";
import { styleAddBlockButtonClicked } from "../../../../../actions";

export type Props = {
  computedStyleBlocks: ComputedStyleBlock[];
  dispatch: Dispatch;
};

export default (Base: React.ComponentClass<BaseStylesSectionProps>) => {
  class StylesSection extends React.Component<Props> {
    onAddButtonClick = () => {
      this.props.dispatch(styleAddBlockButtonClicked());
    };
    render() {
      const { onAddButtonClick } = this;
      const { computedStyleBlocks, dispatch } = this.props;
      const styleBlocks = computedStyleBlocks.map((styleBlock, i) => {
        return <StyleBlock styleBlock={styleBlock} dispatch={dispatch} />;
      });

      return (
        <Base
          content={styleBlocks}
          addButtonProps={{
            onClick: onAddButtonClick
          }}
        />
      );
    }
  }

  return StylesSection;
};
