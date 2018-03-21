import * as React from "react";
import * as ReactDOM from "react-dom";
import { compose, pure, lifecycle } from "recompose";

export type AutofocusProps = {
  children: any;
  focus?: boolean;
  select?: boolean;
}

const AutofocusBase = ({ children }) => children;

const enhanceAutofocus = compose<AutofocusProps, AutofocusProps>(
  pure,
  lifecycle<AutofocusProps, any>({
    componentDidMount() {
      if (this.props.focus !== false) {
        (ReactDOM.findDOMNode(this as any) as HTMLInputElement).focus();
      }
      if (this.props.select !== false) {
        (ReactDOM.findDOMNode(this as any) as HTMLInputElement).select();
      }
    }
  })
);

export const Autofocus = enhanceAutofocus(AutofocusBase);
