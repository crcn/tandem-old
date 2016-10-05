import "./index.scss";

import * as React from "react";
import * as ReactDOM from "react-dom";

class Message extends React.Component<any, any> {
  render() {
    return <span>{this.props.text}</span>;
  }
}

class TestComponent extends React.Component<any, any> {
  render() {
    return <div className="component"><span>Hello {<Message text={this.props.message} />}</span></div>;
  }
}

ReactDOM.render(<TestComponent message={<Message text="blogf" />} />, document.body, () => {
});