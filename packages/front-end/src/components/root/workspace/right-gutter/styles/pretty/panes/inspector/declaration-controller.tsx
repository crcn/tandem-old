import { BaseDeclarationProps, DeclarationInput } from "./view.pc";
import * as React from "react";

export type Props = {
  name?: string;
  value?: string;
  focusName?: boolean;
  onNameChangeComplete?: (newName: string) => void;
  onValueChangeComplete?: (newValue: string, tabbed?: boolean) => void;
  onValueKeyDown?: any;
  onCreate?: (name: string, value: string, tabbed?: boolean) => void;
  onRemove?: () => void;
};

type State = {
  newName?: string;
  newValue?: string;
};

export default (Base: React.ComponentClass<BaseDeclarationProps>) => {
  return class StyleDeclarationController extends React.PureComponent<
    Props,
    State
  > {
    state: State = {};
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
    onValueChange = (newValue: string) => {
      this.setState({ ...this.state, newValue });
      if (!newValue || !newValue.trim()) {
        if (this.props.onRemove) {
          this.props.onRemove();
        }
      } else {
        if (this.props.onValueChangeComplete) {
          this.props.onValueChangeComplete(newValue);
        }

        if (!this.props.name && this.props.onCreate) {
          this.props.onCreate(this.state.newName, newValue);
        }
      }
    };
    render() {
      const { newName, newValue } = this.state;
      const { name, value, focusName, onValueKeyDown } = this.props;
      const { onNameChange, onValueChange } = this;

      return (
        <Base
          property={
            <NameField
              value={newName || name}
              focus={focusName}
              onChangeComplete={onNameChange}
            />
          }
          value={
            <ValueField
              value={newValue || value}
              onChangeComplete={onValueChange}
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
  };
  onChangeComplete = (value: string) => {
    this.props.onChangeComplete(value);
    this.onBlur();
  };
  onBlur = () => {
    this.setState({ ...this.state, active: false });
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
        active: nextProps.focus
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
  onChangeComplete: any;
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
  onChangeComplete = (value: string, event: KeyboardEvent) => {
    this.props.onChangeComplete(value, event);
    this.onBlur();
  };
  render() {
    const { onFocus, onBlur, onChangeComplete } = this;
    const { active } = this.state;
    const { value, onKeyDown } = this.props;
    return (
      <div tabIndex={active ? -1 : 0} onFocus={onFocus}>
        {active ? (
          <DeclarationInput
            focus
            onChangeComplete={onChangeComplete}
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
