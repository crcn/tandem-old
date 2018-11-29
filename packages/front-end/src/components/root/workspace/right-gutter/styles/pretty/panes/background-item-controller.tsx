import * as React from "react";
import { BaseBackgroundItemProps } from "./backgrounds.pc";
import { PCVariable } from "paperclip";
import { getPrettyPaneColorSwatchOptionGroups } from "./utils";

export type Props = {
  value: string;
  onChange: any;
  documentColors: string[];
  globalVariables: PCVariable[];
  onChangeComplete: (value: string) => any;
};

export default (Base: React.ComponentClass<BaseBackgroundItemProps>) =>
  class BackgroundItemController extends React.PureComponent<Props> {
    render() {
      const {
        documentColors,
        value,
        onChange,
        onChangeComplete,
        globalVariables
      } = this.props;
      return (
        <Base
          backgroundInputProps={{
            swatchOptionGroups: getPrettyPaneColorSwatchOptionGroups(
              documentColors,
              globalVariables
            ),
            value,
            onChange,
            onChangeComplete
          }}
          textInputProps={{
            value,
            onChangeComplete
          }}
        />
      );
    }
  };
