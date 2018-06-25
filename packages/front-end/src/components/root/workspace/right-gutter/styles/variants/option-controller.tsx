import * as React from "react";
import { compose, pure, withHandlers, withState } from "recompose";
import { PCVariant } from "paperclip";
import { Dispatch } from "react-redux";
import * as cx from "classnames";
import { variantDefaultSwitchClicked, variantLabelChanged, variantClicked } from "actions";
import { FocusComponent } from "../../../../../focus";
const { TextInput } = require("../../../../../inputs/text/view.pc");

export type OptionControllerOuterProps = {
  variant: PCVariant;
  dispatch: Dispatch<any>;
  selected: boolean;
  onToggle?: any;
  onClick?: any;
  editable?: boolean;
};

type OptionControllerInnerProps = {
  editingLabel?: boolean;
  onSwitchChange: any;
  onLabelChange: any;
  setEditingLabel: any;
  onInputClick: any;
  onClick: any;
} & OptionControllerOuterProps;

export default compose(
  pure,
  withState("editingLabel", "setEditingLabel", false),
  withHandlers({
    onSwitchChange: ({ variant, dispatch, onToggle }: OptionControllerInnerProps) => (event) => {
      if (onToggle) {
        onToggle(variant, event);
      } else {
        dispatch(variantDefaultSwitchClicked(variant));
      }
    },
    onInputClick: ({ setEditingLabel, editable }) => (event) => {
      if (editable !== false) {
        setEditingLabel(true);
        event.stopPropagation();
      }
    },
    onLabelChange: ({ variant, dispatch, setEditingLabel }) => (value) => {
      setEditingLabel(false);
      dispatch(variantLabelChanged(variant, value));
    },
    onClick: ({ variant, dispatch, onClick }) => (event) => {
      if (onClick) {
        onClick(variant, event);
      } else {
        dispatch(variantClicked(variant));
      }
    }
  }),
  Base => ({ onClick, editingLabel, onInputClick, onLabelChange, variant, onSwitchChange, selected, ...rest }: OptionControllerInnerProps) => {
    if (!variant) {
      return null;
    }
    return <Base
      onClick={onClick}
      variant={cx({ selected })}
      switchProps={{value: variant.isDefault, onChangeComplete: onSwitchChange}}
      inputProps={{
        onClick: onInputClick,
        children: editingLabel ? <FocusComponent>{<TextInput value={variant.label} onChangeComplete={onLabelChange} />}</FocusComponent> : (variant.label || "Click to edit")
      }}
      {...rest}
    />;
  }
)