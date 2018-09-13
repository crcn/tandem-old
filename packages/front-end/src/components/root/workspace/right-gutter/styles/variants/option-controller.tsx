import * as React from "react";
import { PCVariant } from "paperclip";
import { Dispatch } from "redux";
import * as cx from "classnames";
import {
  variantDefaultSwitchClicked,
  variantLabelChanged
} from "../../../../../../actions";
import { FocusComponent } from "../../../../../focus";
import { BaseVariantOptionProps } from "./option.pc";
const { TextInput } = require("../../../../../inputs/text/view.pc");

export type Props = {
  variant: PCVariant;
  enabled: boolean;
  dispatch: Dispatch<any>;
  onToggle?: any;
  onClick?: any;
  editable?: boolean;
  onReset?: any;
} & BaseVariantOptionProps;

type State = {
  editingLabel: boolean;
};

export default (Base: React.ComponentClass<BaseVariantOptionProps>) =>
  class OptionsController extends React.PureComponent<Props, State> {
    state = {
      editingLabel: false
    };
    setEditingLabel = (value: boolean) => {
      this.setState({ ...this.state, editingLabel: value });
    };
    onSwitchChange = () => {
      const { onToggle, dispatch, variant } = this.props;
      if (onToggle) {
        onToggle(variant, event);
      } else {
        dispatch(variantDefaultSwitchClicked(variant));
      }
    };
    onInputClick = event => {
      const { editingLabel } = this.state;
      if (editingLabel !== false) {
        this.setEditingLabel(true);
        event.stopPropagation();
      }
    };
    onLabelChange = (value: string) => {
      const { variant, dispatch } = this.props;
      this.setEditingLabel(false);
      dispatch(variantLabelChanged(variant, value));
    };
    render() {
      const { onSwitchChange, onInputClick, onLabelChange } = this;
      const { editingLabel } = this.state;
      const { variant, onReset, enabled, ...rest } = this.props;
      if (!variant) {
        return null;
      }
      return (
        <Base
          {...rest}
          switchProps={{
            value: enabled,
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
        />
      );
    }
  };
