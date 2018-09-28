import * as React from "react";
import { attributeChanged } from "../../../../../actions";
import { SyntheticElement, PCComponent, PCElement, PCComponentInstanceElement } from "paperclip";
import { Dispatch } from "redux";

export type Props = {
  dispatch: Dispatch<any>;
  sourceNode: PCComponent | PCElement | PCComponentInstanceElement;
};

export default (Base: React.ComponentClass<any>) =>
  class InputController extends React.PureComponent<Props> {
    onPlaceholderChange = value => {
      this.props.dispatch(attributeChanged("placeholder", value));
    };
    render() {
      const { sourceNode } = this.props;
      const { onPlaceholderChange } = this;
      return (
        <Base
          placeholderInputProps={{
            value: sourceNode.attributes.placeholder,
            onChange: onPlaceholderChange
          }}
        />
      );
    }
  };
