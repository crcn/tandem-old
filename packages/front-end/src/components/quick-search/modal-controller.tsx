import * as React from "react";
import { compose, pure, withHandlers } from "recompose";
import { RootState } from "../../state";
import { Dispatch } from "react-redux";
import { quickSearchBackgroundClick } from "actions";

export type ModalOuterProps = {
  root: RootState;
  dispatch: Dispatch<any>;
};

type ModalInnerProps = {
  onBackgroundClick: any;
} & ModalOuterProps;

export default compose<ModalOuterProps, ModalOuterProps>(
  pure,
  withHandlers({
    onBackgroundClick: ({ dispatch }) => () => {
      dispatch(quickSearchBackgroundClick());
    }
  }),
  Base => ({ root, dispatch, onBackgroundClick }: ModalInnerProps) => {
    if (!root.showQuickSearch) {
      return null;
    }
    return (
      <Base
        backgroundProps={{
          onClick: onBackgroundClick
        }}
        quickSearchProps={{
          root,
          dispatch
        }}
      />
    );
  }
);
