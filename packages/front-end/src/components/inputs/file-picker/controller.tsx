import * as React from "react";
import { BaseFileInputProps } from "./view.pc";

export type Props = {
  value: string;
};

export type State = {
  _value: string;
};

export default (Base: React.ComponentClass<BaseFileInputProps>) =>
  class FileInputController extends React.PureComponent<Props> {
    onBrowseButtonClick = (event: React.MouseEvent<any>) => {};
    onFilePathInputChange = value => {};
    render() {
      const { onBrowseButtonClick, onFilePathInputChange } = this;
      const { value, ...rest } = this.props;
      return (
        <Base
          {...rest}
          browseBottomProps={{
            onClick: onBrowseButtonClick
          }}
          filePathInputProps={{
            value: value,
            onChange: onFilePathInputChange
          }}
        />
      );
    }
  };
