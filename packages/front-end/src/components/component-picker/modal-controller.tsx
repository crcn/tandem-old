import * as React from "react";
import { compose, pure, withHandlers } from "recompose";
import { RootState, ToolType } from "state";
import { Dispatch } from "redux";
import { componentPickerBackgroundClick } from "actions";
import { BaseModalProps } from "./modal.pc";

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
      dispatch(componentPickerBackgroundClick());
    }
  }),
  (Base: React.ComponentClass<BaseModalProps>) => ({
    onBackgroundClick,
    root,
    dispatch
  }: InnerProps) => {
    if (root.toolType === ToolType.COMPONENT && !root.selectedComponentId) {
      return (
        <Base
          backgroundProps={{
            onClick: onBackgroundClick
          }}
          pickerProps={{
            root,
            dispatch
          }}
        />
      );
    }
    return null;
  }
);
