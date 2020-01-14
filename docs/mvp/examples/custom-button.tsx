import * as React from "react";

export default Template => class CustomButton extends React.Component {
  render() {
    return <Template message={this.props.firstName + " hello"} />;
  }
}