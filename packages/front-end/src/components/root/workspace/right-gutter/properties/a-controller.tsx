import * as React from "react";
import { BaseAPropertiesProps } from "./view.pc";
import { Dispatch } from "redux";
import {
  PCNode,
  PCElement,
  PCComponent,
  PCComponentInstanceElement
} from "paperclip";
import { attributeChanged } from "../../../../../actions";

export type Props = {
  dispatch: Dispatch<any>;
  sourceNode: PCElement | PCComponent | PCComponentInstanceElement;
};

export default (Base: React.ComponentClass<BaseAPropertiesProps>) =>
  class APropertiesController extends React.PureComponent<Props> {
    onHrefChangeComplete = value => {
      this.props.dispatch(attributeChanged("href", value));
    };
    render() {
      const { sourceNode, ...rest } = this.props;
      const { onHrefChangeComplete } = this;
      if (sourceNode.is !== "a") {
        return null;
      }

      return (
        <Base
          {...rest}
          hrefInputProps={{
            value: sourceNode.attributes.href,
            onChange: onHrefChangeComplete
          }}
        />
      );
    }
  };
