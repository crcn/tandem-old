import * as React from "react";
import * as ReactDOM from "react-dom";
import { compose, pure, lifecycle } from "recompose";

export type AutofocusProps = {
  children: any;
}

const AutofocusBase = ({ children }) => (<span>{children}</span>);

const enhanceAutofocus = compose<AutofocusProps, AutofocusProps>(
  pure,
  lifecycle({
    componentDidMount() {
      ReactDOM.findDOMNode(this as any).querySelector("input").focus();
    }
  })
);

export const Autofocus = enhanceAutofocus(AutofocusBase);
