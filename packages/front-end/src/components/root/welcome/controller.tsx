import * as React from "react";
import { compose, pure, withHandlers } from "recompose";
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

export default compose<BaseWelcomeProps, Props>(
  pure,
  withHandlers({
    onOpenProjectButtonClick: ({ dispatch }) => () => {
      dispatch(openProjectButtonClicked());
    },
    onCreateProjectButtonClick: ({ dispatch }) => () => {
      dispatch(createProjectButtonClicked());
    }
  }),
  (Base: React.ComponentClass<BaseWelcomeProps>) => ({
    onOpenProjectButtonClick,
    onCreateProjectButtonClick
  }: InnerProps) => {
    return (
      <Base
        openProjectButtonProps={{ onClick: onOpenProjectButtonClick }}
        createProjectButtonProps={{ onClick: onCreateProjectButtonClick }}
      />
    );
  }
);
