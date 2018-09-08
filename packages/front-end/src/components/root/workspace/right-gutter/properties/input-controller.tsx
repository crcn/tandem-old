import * as React from "react";
import { attributeChanged } from "../../../../../actions";
import { SyntheticElement } from "paperclip";
import { Dispatch } from "redux";

export type Props = {
  dispatch: Dispatch<any>;
  selectedNodes: SyntheticElement[];
};

export default (Base: React.ComponentClass<any>) =>
  class InputController extends React.PureComponent<Props> {
    onPlaceholderChange = value => {
      this.props.dispatch(attributeChanged("placeholder", value));
    };
    render() {
      const { selectedNodes } = this.props;
      const { onPlaceholderChange } = this;
      if (!selectedNodes.length) {
        return null;
      }
      const element = selectedNodes[0];
      return (
        <Base
          placeholderInputProps={{
            value: element.attributes.placeholder,
            onChange: onPlaceholderChange
          }}
        />
      );
    }
  };
