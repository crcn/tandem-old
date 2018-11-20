import * as React from "react";
import { BaseMediaQueryOptionsProps } from "./view.pc";
import { PCMediaQueryCondition } from "paperclip";
export type Props = {
  condition: PCMediaQueryCondition;
};

export default (Base: React.ComponentClass<BaseMediaQueryOptionsProps>) =>
  class MediaQueryOptionsController extends React.PureComponent<Props> {
    onMinWidthChange = (value: string) => {};
    onMaxWidthChange = (value: string) => {};
    render() {
      const { onMinWidthChange, onMaxWidthChange } = this;
      const { ...rest } = this.props;
      return (
        <Base
          {...rest}
          minWidthInputProps={{
            onChangeComplete: onMinWidthChange
          }}
          maxWidthInputProps={{
            onChangeComplete: onMaxWidthChange
          }}
        />
      );
    }
  };
