import "./index.scss";
import React =  require("react");

export class TabsComponent extends React.Component<any, any> {
  render() {
    return <div className="tabs-component">
      <ul className="navbar">
        <li>HTML</li>
        <li>CSS</li>
      </ul>
      <div>
        { this.props.children }
      </div>
    </div>;
  }
}