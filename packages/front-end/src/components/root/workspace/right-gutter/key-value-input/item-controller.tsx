import { BaseKeyValueItemProps, KeyValueItemTextInput } from "./view.pc";
import * as React from "react";

export type Props = {
  name: string;
  editName?: boolean;
  value: string;
  onValueEnterPressed?: () => void;
};

export default (Base: React.ComponentClass<BaseKeyValueItemProps>) => {
  return class KeyValueItemController extends React.Component<Props> {
    onValueChange = (value: string) => {};
    onNameChangeComplete = (label: string) => {};
    onLastEntered = () => {};
    render() {
      if (!this.props) {
        return null;
      }
      const { onNameChangeComplete, onValueChange, onLastEntered } = this;
      const { name, value, onValueEnterPressed, editName } = this.props;
      return (
        <Base
          label={
            <EditableLabel
              value={name}
              editing={editName || name == null}
              onChangeComplete={onNameChangeComplete}
            >
              {name}
            </EditableLabel>
          }
          value={
            <EditableLabel
              value={value}
              onChange={onValueChange}
              onEnterPressed={onValueEnterPressed}
            >
              {value}
            </EditableLabel>
          }
        />
      );
    }
  };
};

type EditableLabelProps = {
  value: string;
  editing?: boolean;
  onEnterPressed?: () => void;
  onChangeComplete?: (value: string) => void;
  onChange?: (value: string) => void;
};

type EditableLabelState = {
  editing: boolean;
};

class EditableLabel extends React.Component<
  EditableLabelProps,
  EditableLabelState
> {
  state = { editing: false };

  static getDerivedStateFromProps(
    nextProps: EditableLabelProps,
    prevState: EditableLabelState
  ): EditableLabelState {
    if (nextProps.editing != null) {
      return {
        ...prevState,
        editing: nextProps.editing
      };
    }
    return prevState;
  }

  onClick = () => {
    this.setState({ editing: true });
  };
  onKeyPress = (event: React.KeyboardEvent<any>) => {
    if (event.key === "Enter") {
      const targetValue = (event.target as HTMLInputElement).value;
      this.setState({ editing: false }, () => {
        if (this.props.onEnterPressed) {
          this.props.onEnterPressed();
        }
      });
    }
  };
  onFocus = () => {
    this.setState({ editing: true });
  };
  onBlur = () => {
    this.setState({ editing: false });
  };
  render() {
    const { onClick, onKeyPress, onBlur, onFocus } = this;
    const { value, onChange, onChangeComplete } = this.props;
    const { editing } = this.state;
    if (editing) {
      return (
        <KeyValueItemTextInput
          focus
          value={value}
          onBlur={onBlur}
          onChange={onChange as any}
          onChangeComplete={onChangeComplete}
          onKeyPress={onKeyPress}
        />
      );
    }
    return (
      <div tabIndex={0} onFocus={onFocus} onClick={onClick}>
        {this.props.children}
      </div>
    );
  }
}
