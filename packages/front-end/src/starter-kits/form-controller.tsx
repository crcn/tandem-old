import * as React from "react";
import { BaseStarterKitFormOptionsProps } from "./form.pc";
import { Dispatch } from "redux";
import { ProjectTemplate } from "../state";
import { browseDirectoryClicked } from "../actions";

export type Options = {
  directory: string;
};

export type Props = {
  template: ProjectTemplate;
  onChangeComplete: (options: Options) => void;
  selectedDirectory: string;
  dispatch: Dispatch<any>;
};

type State = {
  directory: string;
  _directory: string;
};

export default (Base: React.ComponentClass<BaseStarterKitFormOptionsProps>) =>
  class FormController extends React.PureComponent<Props, State> {
    state = {
      directory: null,
      _directory: null
    };
    static getDerivedStateFromProps = (props: Props, state: State) => {
      let newState = state;
      if (
        props.selectedDirectory &&
        props.selectedDirectory !== state._directory
      ) {
        newState = {
          ...newState,
          _directory: props.selectedDirectory,
          directory: props.selectedDirectory
        };
      }
      return newState !== state ? newState : null;
    };
    onCreateButtonClick = () => {
      this.props.onChangeComplete({
        directory: this.state.directory
      });
    };
    onBrowserDirectoryClick = () => {
      this.props.dispatch(browseDirectoryClicked());
    };
    onDirectoryChange = directory => {
      this.setState({ ...this.state, directory });
    };
    render() {
      const {
        onBrowserDirectoryClick,
        onDirectoryChange,
        onCreateButtonClick
      } = this;
      const { template, ...rest } = this.props;
      const { directory } = this.state;
      console.log(directory);
      return (
        <Base
          {...rest}
          titleProps={{
            text: `New ${template.label} Project`
          }}
          directoryInputProps={{
            value: directory,
            onChange: onDirectoryChange
          }}
          browseButtonProps={{
            onClick: onBrowserDirectoryClick
          }}
          createProjectButtonProps={{
            onClick: onCreateButtonClick
          }}
        />
      );
    }
  };
