import * as React from "react";
import * as ReactDOM from "react-dom";
import { compose } from "recompose";
import { FocusComponent, FocusProps } from "../../focus";
import { BaseTextInputProps } from "./view.pc";

export type WithInputHandlersProps = {
  value?: any;
  onChange?: any;
  onChangeComplete?: any;
  disabled?: boolean;
  onBlur?: any;
} & BaseTextInputProps;

type State = {
  value: string;
  _value: string;
};

export const withPureInputHandlers = () => (
  Base: React.ComponentClass<any>
) => {
  return class InputHandlersWrapper extends React.PureComponent<
    WithInputHandlersProps,
    State
  > {
    // needed so that sub components get updates value if source doesn't change.
    state = {
      value: this.props.value,
      _value: this.props.value
    };

    static getDerivedStateFromProps(
      props: WithInputHandlersProps,
      state: State
    ) {
      let newState = state;
      if (props.value !== state._value) {
        newState = {
          ...newState,
          _value: props.value,
          value: props.value
        };
      }

      return newState === state ? null : newState;
    }

    onKeyDown = event => {
      const { onKeyDown, onChange, onChangeComplete } = this.props;

      if (onKeyDown) {
        onKeyDown(event);
      }
      const nativeEvent = event.nativeEvent;

      setTimeout(() => {
        const {
          key,
          target: { value: newValue }
        } = nativeEvent;

        const oldState = this.state;

        this.setState({
          ...oldState,
          value: newValue
        });

        // need to call immediately in case of BLUR
        if (onChange && oldState.value !== newValue) {
          onChange(newValue || undefined, nativeEvent);
        }

        console.log(key, onChangeComplete);

        if ((key === "Enter" || key === "Tab") && onChangeComplete) {
          onChangeComplete(newValue || undefined);
        }
      });
    };
    componentDidUpdate(props) {
      if (props.value !== this.props.value) {
        const input = ReactDOM.findDOMNode(this as any) as HTMLTextAreaElement;
        if (document.activeElement !== input) {
          input.value = this.props.value == null ? "" : this.props.value;
        }
      }
    }
    onBlur = event => {
      // possibly clicked somewhere on stage to trigger blur.
      if (
        this.state._value !== this.state.value &&
        this.props.onChangeComplete
      ) {
        this.props.onChangeComplete(this.state.value);
      }

      if (this.props.onBlur) {
        this.props.onBlur(event);
      }
    };
    render() {
      const { onKeyDown, onBlur } = this;
      return <Base {...this.props} onKeyDown={onKeyDown} onBlur={onBlur} />;
    }
  };
};

export type Props = WithInputHandlersProps & FocusProps;

export default compose<BaseTextInputProps, Props>(
  withPureInputHandlers(),
  (Base: React.ComponentClass<BaseTextInputProps>) => ({
    value,
    focus,
    onChange,
    onChangeComplete,
    ...rest
  }) => {
    return (
      <FocusComponent focus={Boolean(focus)}>
        <Base {...rest} defaultValue={value} />
      </FocusComponent>
    );
  }
);
