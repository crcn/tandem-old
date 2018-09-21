import * as React from "react";
import { BaseNewFileInputProps } from "./view.pc";
import { FocusComponent } from "../../../../focus";

export type Props = {
  onChangeComplete: any;
} & BaseNewFileInputProps;

export default (Base: React.ComponentClass<BaseNewFileInputProps>) =>
  class NewFileInputController extends React.PureComponent<Props> {
    onBlur = () => {
      this.props.onChangeComplete(null);
    };
    render() {
      const { ...rest } = this.props;
      const { onBlur } = this;
      return (
        <FocusComponent>
          <Base {...rest} labelInputProps={{ onBlur }} />
        </FocusComponent>
      );
    }
  };
