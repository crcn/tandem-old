import * as React from "react";
import * as ReactDOM from "react-dom";
import { compose, pure, withHandlers, lifecycle } from "recompose";
import { FocusComponent, FocusProps } from "../../focus";
import { BaseTextInputProps } from "./view.pc";

export type WithInputHandlersProps = {
  value?: any;
  onChange?: any;
  onChangeComplete?: any;
} & BaseTextInputProps;

export const withInputHandlers = () =>
  compose(
    withHandlers({
      onKeyDown: ({ onChange, onChangeComplete }) => event => {
        const nativeEvent = event.nativeEvent;
        setImmediate(() => {
          const {
            key,
            target: { value }
          } = nativeEvent;
          if (onChange) {
            onChange(value || undefined);
          }

          if (key === "Enter" && onChangeComplete) {
            onChangeComplete(value || "");
          }
        });
      },
      onBlur: ({ onChangeComplete }) => event => {
        if (onChangeComplete) {
          onChangeComplete(event.target.value);
        }
      }
    }),
    lifecycle({
      componentDidUpdate(props: WithInputHandlersProps) {
        if (props.value !== this.props.value) {
          const input = ReactDOM.findDOMNode(
            this as any
          ) as HTMLTextAreaElement;
          if (document.activeElement !== input) {
            input.value = this.props.value == null ? "" : this.props.value;
          }
        }
      }
    })
  );

export type Props = WithInputHandlersProps & FocusProps;

export default compose<BaseTextInputProps, Props>(
  pure,
  withInputHandlers(),
  (Base: React.ComponentClass<BaseTextInputProps>) => ({
    value,
    onChange,
    onChangeComplete,
    focus,
    ...rest
  }) => {
    return (
      <FocusComponent focus={Boolean(focus)}>
        <Base {...rest} defaultValue={value} />
      </FocusComponent>
    );
  }
);
