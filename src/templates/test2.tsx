import * as React from "react";

export class Component extends React.Component<any, any>{
  render() {
    return <div>hello { this.props.message }</div>;
  }
}