import * as React from "react";
import * as ReactDOM from "react-dom";
import { BaseNewFileInputProps } from "./view.pc";
import { FocusComponent } from "../../../../focus";
import scrollIntoView from "scroll-into-view-if-needed";

export type Props = {
  onChangeComplete: any;
  onChange: any;
} & BaseNewFileInputProps;

export default (Base: React.ComponentClass<BaseNewFileInputProps>) =>
  class NewFileInputController extends React.PureComponent<Props> {
    onBlur = (event: React.FocusEvent<any>) => {
      this.props.onChangeComplete(event.target.value);
    };
    onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      const target = event.target;
      const key = event.key;
      setTimeout(() => {
        this.props.onChange((target as HTMLInputElement).value);
        if (key === "Enter") {
          this.props.onChangeComplete((target as HTMLInputElement).value);
        }
      });
    };
    componentDidMount() {
      const self = ReactDOM.findDOMNode(this) as HTMLDivElement;
      // icky, but we're picking the label here
      scrollIntoView(self, {
        scrollMode: "if-needed"
      });
    }
    render() {
      const { onChange, onChangeComplete, ...rest } = this.props;
      const { onBlur, onKeyDown } = this;
      return (
        <FocusComponent>
          <Base {...rest} labelInputProps={{ onBlur, onKeyDown: onKeyDown }} />
        </FocusComponent>
      );
    }
  };
