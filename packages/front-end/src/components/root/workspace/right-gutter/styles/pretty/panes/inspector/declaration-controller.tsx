import { BaseDeclarationProps, DeclarationInput } from "./view.pc";
import * as React from "react";

export type Props = {
  name?: string;
  value?: string;
  focusName?: boolean;
  onNameChangeComplete?: (newName: string) => void;
  onValueChange?: (newValue: string) => void;
  onValueKeyDown?: any;
  onCreate?: (name: string, value: string) => void;
  onRemove?: () => void;
};

type State = {
  newName?: string;
  newValue?: string;
  nameFocused?: boolean;
  focusName?: boolean;
  _name?: string;
  _value?: string;
};

export default (Base: React.ComponentClass<BaseDeclarationProps>) => {
  return class StyleDeclarationController extends React.PureComponent<
    Props,
    State
  > {
    state: State = {};
    static getDerivedStateFromProps(props: Props, state: State): State {
      let newState = state;
      if (props.name !== state._name || props.value !== state._value) {
        newState = {
          ...newState,
          newName: undefined,
          newValue: undefined,
          _name: props.name,
          _value: props.value
        };
      }
      return newState === state ? null : newState;
    }
    onNameChange = (newName: string) => {
      this.setState({ ...this.state, newName });
      if (!newName || !newName.trim()) {
        if (this.props.onRemove) {
          this.props.onRemove();
        }
      } else {
        if (this.props.onNameChangeComplete) {
          this.props.onNameChangeComplete(newName);
        }
      }
    };
    onValueChange = (newValue: string, event) => {
      this.setState({ ...this.state, newValue });
      if (this.props.name && this.props.onValueChange) {
        this.props.onValueChange(newValue);
      }

      if (!this.props.name && this.props.onCreate) {
        this.props.onCreate(this.state.newName, newValue);
      }
    };
    onNameFocus = () => {
      this.setState({ ...this.state, nameFocused: true, focusName: undefined });
    };
    onNameBlur = () => {
      this.setState({ ...this.state, nameFocused: false });
    };
    onValueKeyDown = (event: React.KeyboardEvent<any>) => {
      if (this.props.onValueKeyDown) {
        this.props.onValueKeyDown(event);
      }
      if (event.key === "Tab") {
        if (!this.props.value && this.props.onRemove) {
          this.props.onRemove();

          if (!event.shiftKey) {
            event.preventDefault();
            this.setState({ ...this.state, focusName: true });
          }
        }
      }
    };
    render() {
      const { newName, newValue, focusName: focusName2 } = this.state;
      const { name, value, focusName } = this.props;
      const {
        onNameChange,
        onValueChange,
        onNameFocus,
        onNameBlur,
        onValueKeyDown
      } = this;
      return (
        <Base
          property={
            <NameField
              value={newName || name}
              focus={focusName2 || focusName}
              onChangeComplete={onNameChange}
              onFocus={onNameFocus}
              onBlur={onNameBlur}
            />
          }
          value={
            <ValueField
              value={newValue || value}
              onChange={onValueChange}
              onKeyDown={onValueKeyDown}
            />
          }
        />
      );
    }
  };
};

type NameFieldProps = {
  focus?: boolean;
  value: string;
  onChangeComplete: any;
  onFocus: any;
  onBlur: any;
};

type NameFieldState = {
  active?: boolean;
  _focus?: boolean;
};

class NameField extends React.PureComponent<NameFieldProps, NameFieldState> {
  state = {
    active: false,
    _focus: false
  };
  onFocus = () => {
    this.setState({ ...this.state, active: true });
    this.props.onFocus();
  };
  onChangeComplete = (value: string) => {
    this.props.onChangeComplete(value);
    this.setState({ ...this.state, active: false });
  };
  onBlur = event => {
    this.props.onBlur(event);
  };

  static getDerivedStateFromProps(
    nextProps: NameFieldProps,
    prevState: NameFieldState
  ): NameFieldState {
    let state = prevState;
    if (nextProps.focus !== prevState._focus) {
      state = {
        ...prevState,
        _focus: nextProps.focus,
        active: nextProps.focus || state.active
      };
    }
    return state === prevState ? null : state;
  }
  render() {
    const { value } = this.props;
    const { onFocus, onBlur, onChangeComplete } = this;
    const { active } = this.state;

    return (
      <div tabIndex={active ? -1 : 0} onFocus={onFocus}>
        {active ? (
          <DeclarationInput
            focus
            onChangeComplete={onChangeComplete}
            value={value}
            onBlur={onBlur}
          />
        ) : (
          value
        )}
      </div>
    );
  }
}

type ValueFieldProps = {
  value: string;
  onChange: any;
  onKeyDown?: any;
};

type ValueFieldState = {
  active: boolean;
};

class ValueField extends React.PureComponent<ValueFieldProps, ValueFieldState> {
  state = {
    active: false
  };

  onFocus = () => {
    this.setState({ ...this.state, active: true });
  };
  onBlur = () => {
    this.setState({ ...this.state, active: false });
  };
  onChange = value => {
    this.props.onChange(value);
  };
  render() {
    const { onFocus, onBlur, onChange } = this;
    const { active } = this.state;
    const { value, onKeyDown } = this.props;
    return (
      <div tabIndex={active ? -1 : 0} onFocus={onFocus}>
        {active ? (
          <DeclarationInput
            focus
            onChange={onChange}
            value={value}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
          />
        ) : (
          value
        )}
      </div>
    );
  }
}
