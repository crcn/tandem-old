import React =  require("React");

export class Hello extends React.Component<any, any> {
  render()  {
    return <div>Hello {this.props.text}</div>;
  }
}