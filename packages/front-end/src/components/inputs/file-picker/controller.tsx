import * as React from "react";
import { FILE_PROTOCOL, addProtocol } from "tandem-common";
import { BaseFileInputProps } from "./view.pc";
import { OpenFileContext, FileOpener } from "../../../components/contexts";

export type Props = {
  value: string;
  onChange?: (value: string) => void;
};

export type State = {
  _value: string;
  value: string;
};

export default (Base: React.ComponentClass<BaseFileInputProps>) =>
  class FileInputController extends React.PureComponent<Props> {
    state = {
      _value: this.props.value,
      value: this.props.value
    };
    private _openFile: FileOpener;
    onBrowseButtonClick = async () => {
      const filePath = await this._openFile({
        name: "Open Image",
        extensions: ["jpg", "png", "svg", "gif", "jpeg"]
      });

      const fileUri = addProtocol(FILE_PROTOCOL, filePath);
      this.onFileUriChange(fileUri);
    };

    static getDerivedStateFromProps(nextProps: Props, prevState: State): State {
      let state = prevState;

      if (nextProps.value != prevState._value) {
        state = {
          ...state,
          _value: nextProps.value,
          value: nextProps.value
        };
      }

      return state === prevState ? null : state;
    }

    onFilePathInputChange = fileUri => {
      this.onFileUriChange(fileUri);
    };

    onFileUriChange = (fileUri: string) => {
      this.setState(
        {
          value: fileUri
        },
        () => {
          if (this.props.onChange) {
            this.props.onChange(fileUri);
          }
        }
      );
    };
    render() {
      const { value } = this.state;
      const { onBrowseButtonClick, onFilePathInputChange } = this;
      const { onChange, ...rest } = this.props;
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
                  value,
                  onChange: onFilePathInputChange
                }}
              />
            );
          }}
        </OpenFileContext.Consumer>
      );
    }
  };
