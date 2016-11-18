import * as React from "react";

export interface IButtonProps {
  className?: string;
  text: string;
}

export class Button extends React.Component<IButtonProps, any> {
  render() {
    const { className, text } = this.props;
    return <div className={["button", className].join(" ")}>
      { this.props.text }
    </div>;
  }
}