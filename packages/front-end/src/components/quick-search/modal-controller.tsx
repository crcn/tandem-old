import * as React from "react";
import { compose, pure, withHandlers } from "recompose";
import { RootState } from "../../state";
import { Dispatch } from "redux";
import { quickSearchBackgroundClick } from "../../actions";
import { BaseModalProps } from "./index.pc";

export type Props = {
  root: RootState;
  dispatch: Dispatch<any>;
};

type InnerProps = {
  onBackgroundClick: any;
} & Props;

export default compose<BaseModalProps, Props>(
  pure,
  withHandlers({
    onBackgroundClick: ({ dispatch }) => () => {
      dispatch(quickSearchBackgroundClick());
    }
  }),
  (Base: React.ComponentClass<BaseModalProps>) => ({
    root,
    dispatch,
    onBackgroundClick
  }: InnerProps) => {
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
