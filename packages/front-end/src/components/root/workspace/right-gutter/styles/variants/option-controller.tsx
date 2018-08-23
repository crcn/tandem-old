import * as React from "react";
import { compose, pure, withHandlers, withState } from "recompose";
import { PCVariant } from "paperclip";
import { Dispatch } from "redux";
import * as cx from "classnames";
import {
  variantDefaultSwitchClicked,
  variantLabelChanged,
  variantClicked
} from "actions";
import { FocusComponent } from "../../../../../focus";
import { BaseVariantOptionProps } from "./option.pc";
const { TextInput } = require("../../../../../inputs/text/view.pc");

export type Props = {
  variant: PCVariant;
  dispatch: Dispatch<any>;
  selected: boolean;
  onToggle?: any;
  onClick?: any;
  editable?: boolean;
  onReset?: any;
} & BaseVariantOptionProps;

type InnerProps = {
  editingLabel?: boolean;
  onSwitchChange: any;
  onLabelChange: any;
  setEditingLabel: any;
  onInputClick: any;
  onClick: any;
} & Props;

export default compose<BaseVariantOptionProps, Props>(
  pure,
  withState("editingLabel", "setEditingLabel", false),
  withHandlers({
    onSwitchChange: ({ variant, dispatch, onToggle }: InnerProps) => event => {
      if (onToggle) {
        onToggle(variant, event);
      } else {
        dispatch(variantDefaultSwitchClicked(variant));
      }
    },
    onInputClick: ({ setEditingLabel, editable }) => event => {
      if (editable !== false) {
        setEditingLabel(true);
        event.stopPropagation();
      }
    },
    onLabelChange: ({ variant, dispatch, setEditingLabel }) => value => {
      setEditingLabel(false);
      dispatch(variantLabelChanged(variant, value));
    },
    onClick: ({ variant, dispatch, onClick }) => event => {
      if (onClick) {
        onClick(variant, event);
      } else {
        dispatch(variantClicked(variant));
      }
    }
  }),
  (Base: React.ComponentClass<BaseVariantOptionProps>) => ({
    onClick,
    editingLabel,
    onInputClick,
    onLabelChange,
    variant,
    onReset,
    onSwitchChange,
    selected,
    ...rest
  }: InnerProps) => {
    if (!variant) {
      return null;
    }
    return (
      <Base
        onClick={onClick}
        variant={cx({ selected })}
        switchProps={{
          value: variant.isDefault,
          onChangeComplete: onSwitchChange
        }}
        resetButtonProps={{
          onClick: onReset && (() => onReset(variant)),
          style: {
            display: onReset ? "block" : "none"
          }
        }}
        inputProps={{
          onClick: onInputClick,
          children: editingLabel ? (
            <FocusComponent>
              {
                <TextInput
                  value={variant.label}
                  onChangeComplete={onLabelChange}
                />
              }
            </FocusComponent>
          ) : (
            variant.label || "Click to edit"
          )
        }}
        {...rest}
      />
    );
  }
);
