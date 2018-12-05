import * as React from "react";
import { BaseFileInputProps } from "./view.pc";
import { OpenFileContext, FileOpener } from "../../../components/contexts";

export type Props = {
  value: string;
};

export type State = {
  _value: string;
};

export default (Base: React.ComponentClass<BaseFileInputProps>) =>
  class FileInputController extends React.PureComponent<Props> {
    private _openFile: FileOpener;
    onBrowseButtonClick = (event: React.MouseEvent<any>) => {
      console.log(this._openFile);
    };
    onFilePathInputChange = value => {};
    render() {
      const { onBrowseButtonClick, onFilePathInputChange } = this;
      const { value, ...rest } = this.props;
      return (
        <OpenFileContext.Consumer>
          {openFile => {
            this._openFile = openFile;
            return (
              <Base
                {...rest}
                browseButtonProps={{
                  onClick: onBrowseButtonClick
                }}
                filePathInputProps={{
                  value: value,
                  onChange: onFilePathInputChange
                }}
              />
            );
          }}
        </OpenFileContext.Consumer>
      );
    }
  };
