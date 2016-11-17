import "./index.scss";
import * as React from "react";

export class HelloComponent extends React.Component<{ text: string }, any> {
  render() {
    return <div className="hello-component">
      {this.props.text}!!!!!
    </div>
  }
}