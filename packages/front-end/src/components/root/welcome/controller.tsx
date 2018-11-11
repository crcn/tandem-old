import * as React from "react";
import {
  openProjectButtonClicked,
  createProjectButtonClicked
} from "../../../actions";
import { BaseWelcomeProps } from "./view.pc";
import { Dispatch } from "redux";
import { cx } from "classnames";

export type Props = {
  dispatch: Dispatch<any>;
};

type State = {
  createProject: boolean;
};

export default (Base: React.ComponentClass<BaseWelcomeProps>) =>
  class WelcomeController extends React.PureComponent<Props, State> {
    state = {
      createProject: false
    };

    onOpenProjectButtonClick = () => {
      this.props.dispatch(openProjectButtonClicked());
    };
    onCreateProjectButtonClick = () => {
      this.setState({ createProject: true });
    };

    onCreateBlankProjectButtonClick = () => {
      // this.props.dispatch()
    };

    onCreateReactProjectButtonClick = () => {};

    render() {
      const {
        onOpenProjectButtonClick,
        onCreateProjectButtonClick,
        onCreateReactProjectButtonClick,
        onCreateBlankProjectButtonClick
      } = this;
      const { createProject } = this.state;
      return (
        <Base
          variant={cx({
            createProject
          })}
          openProjectButtonProps={{ onClick: onOpenProjectButtonClick }}
          createProjectButtonProps={{ onClick: onCreateProjectButtonClick }}
          createReactProjectButtonProps={{
            onClick: onCreateReactProjectButtonClick
          }}
          createBlankProjectButtonProps={{
            onClick: onCreateBlankProjectButtonClick
          }}
        />
      );
    }
  };
