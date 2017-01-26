import "./index.scss";
import React = require("react");

export class ConsoleComponent extends React.Component<any, any> {
  render() {
    return <div className="console-gutter-component">
      <ul className="logs">
        <li className="error">Error</li>
        <li className="warning">Warning</li>
        <li className="notice">Notice me this</li>
        <li>Log one</li>
      </ul>
    </div>;
  }
}