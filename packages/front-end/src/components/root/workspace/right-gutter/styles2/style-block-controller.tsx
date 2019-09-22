import * as React from "react";
import { BaseStyleBlockProps } from "./view.pc";
import { ComputedStyleBlock } from "paperclip";
import { Dispatch } from "redux";
import * as cx from "classnames";
import { StyleBlockNewPropertyAdded } from "../../../../../actions";

export type Props = {
  styleBlock: ComputedStyleBlock;
  dispatch: Dispatch;
};

export default (Base: React.ComponentClass<BaseStyleBlockProps>) => {
  return class StyleBlock extends React.Component<Props> {
    onInsertNewRow = () => {
      this.props.dispatch(
        StyleBlockNewPropertyAdded(
          this.props.styleBlock.owner,
          this.props.styleBlock.block
        )
      );
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
          variant={cx({
            empty: styleBlock.properties.length === 0
          })}
          addButtonProps={{
            onClick: onInsertNewRow
          }}
          keyValueItemProps={null}
          keyValueItemProps1={null}
          keyValueItemProps2={null}
          propertiesListProps={{
            items: styleBlock.properties,
            onInsertNewRow
          }}
        />
      );
    }
  };
};
