import * as React from "react";
import { BaseStyleBlockProps } from "./view.pc";
import { ComputedStyleBlock } from "paperclip";
import { Dispatch } from "redux";
import { styleBlockLastPropertyTabbedOrEntered } from "../../../../../actions";

export type Props = {
  styleBlock: ComputedStyleBlock;
  dispatch: Dispatch;
};

export default (Base: React.ComponentClass<BaseStyleBlockProps>) => {
  return class StyleBlock extends React.Component<Props> {
    onInsertNewRow = () => {
      this.props.dispatch(styleBlockLastPropertyTabbedOrEntered());
    };
    render() {
      const { styleBlock } = this.props;
      const { onInsertNewRow } = this;
      return (
        <Base
          addPropertyDropdownProps={{
            open: false,
            onShouldClose: () => {}
          }}
          propertiesListProps={{
            items: styleBlock.properties,
            onInsertNewRow
          }}
        />
      );
    }
  };
};
