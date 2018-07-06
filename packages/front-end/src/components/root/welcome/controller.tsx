import * as React from "react";
import { compose, pure, withHandlers } from "recompose";
import { openProjectButtonClicked, createProjectButtonClicked } from "actions";

export default compose(
  pure,
  withHandlers({
    onOpenProjectButtonClick: ({ dispatch }) => () => {
      console.log("BUTP");
      dispatch(openProjectButtonClicked());
    },
    onCreateProjectButtonClick: ({ dispatch }) => () => {
      dispatch(createProjectButtonClicked());
    }
  }),
  Base => ({ onOpenProjectButtonClick, onCreateProjectButtonClick }) => {
    return (
      <Base
        openProjectButtonProps={{ onClick: onOpenProjectButtonClick }}
        createProjectButtonProps={{ onClick: onCreateProjectButtonClick }}
      />
    );
  }
);
