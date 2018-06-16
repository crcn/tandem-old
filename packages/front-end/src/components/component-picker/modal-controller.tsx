import * as React from "react";
import { compose, pure, withHandlers } from "recompose";
import { RootState, ToolType } from "state";
import { Dispatch } from "react-redux";
import { componentPickerBackgroundClick } from "actions";

export type ComponentPickerModalOuterProps = {
  root: RootState;
  dispatch: Dispatch<any>;
};

type ComponentPickerModalInnerProps = {
  onBackgroundClick: any;
} & ComponentPickerModalOuterProps;

export default compose<
  ComponentPickerModalInnerProps,
  ComponentPickerModalOuterProps
>(
  pure,
  withHandlers({
    onBackgroundClick: ({ dispatch }) => () => {
      dispatch(componentPickerBackgroundClick());
    }
  }),
  Base => ({
    onBackgroundClick,
    root,
    dispatch
  }: ComponentPickerModalInnerProps) => {
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
