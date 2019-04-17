import { BaseDeclarationProps } from "./view.pc";
import * as React from "react";

export type Props = {
  name: string;
  value: string;
};

export default (Base: React.ComponentClass<BaseDeclarationProps>) => {
  return class StyleDeclarationController extends React.PureComponent<Props> {
    render() {
      const { name, value } = this.props;
      return (
        <Base
          propertyProps={{ children: name }}
          valueProps={{ children: value }}
        />
      );
    }
  };
};
