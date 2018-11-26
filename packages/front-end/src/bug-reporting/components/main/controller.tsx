import * as React from "react";
import { BaseMainProps } from "./view.pc";

export type Props = {
  submitTicket: (description: string) => any;
};

type State = {
  description: string;
};

export default (Base: React.ComponentClass<BaseMainProps>) =>
  class BaseReporterController extends React.PureComponent<Props, State> {
    state = {
      description: null
    };

    onDescriptionChange = description => {
      this.setState({
        description
      });
    };

    onSubmitButtonClick = () => {
      this.props.submitTicket(this.state.description);
    };

    render() {
      const { onDescriptionChange, onSubmitButtonClick } = this;
      const { ...rest } = this.props;
      return (
        <Base
          {...rest}
          descriptionInputProps={{
            onChange: onDescriptionChange
          }}
          submitButtonProps={{ onClick: onSubmitButtonClick }}
        />
      );
    }
  };
