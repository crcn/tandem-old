import * as React from "react";
import {
  openProjectButtonClicked,
  createProjectButtonClicked
} from "../../../actions";
import { BaseWelcomeProps } from "./view.pc";
import { Dispatch } from "redux";

export type Props = {
  dispatch: Dispatch<any>;
};

type InnerProps = {
  onOpenProjectButtonClick: any;
  onCreateProjectButtonClick: any;
} & Props;

export default (Base: React.ComponentClass<BaseWelcomeProps>) =>
  class WelcomeController extends React.PureComponent<Props> {
    onOpenProjectButtonClick = () => {
      this.props.dispatch(openProjectButtonClicked());
    };
    onCreateProjectButtonClick = () => {
      this.props.dispatch(createProjectButtonClicked());
    };
    render() {
      const { onOpenProjectButtonClick, onCreateProjectButtonClick } = this;
      return (
        <Base
          openProjectButtonProps={{ onClick: onOpenProjectButtonClick }}
          createProjectButtonProps={{ onClick: onCreateProjectButtonClick }}
        />
      );
    }
  };
