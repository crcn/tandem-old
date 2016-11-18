import  "./button.scss";
import * as React from "react";

export class Button extends React.Component<any, any> {
  render() {
    return <ul className="button">
      { this.props.items.map((item) => {
        return <li key={item}>{item}</li>;
      })}
    </ul>;
  }
}