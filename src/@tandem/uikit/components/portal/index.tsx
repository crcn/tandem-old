import "./index.scss";
import React =  require("React");
import ReactDOM = require("react-dom");

export interface IPortalComponentProps {
  style?: any;
  className?: any;
}

export class PortalComponent extends React.Component<any, any> {
  private _element: HTMLDivElement;
  componentWillReceiveProps(props) {
    if (!this._element) {
      this._element = document.createElement("div");
      document.body.appendChild(this._element);
    }
    ReactDOM.render(<div className={props.className} style={props.style}>{props.children}</div>, this._element);
  }
  componentWillUnmount() {
    this._element.parentNode.removeChild(this._element);
  }
  render() {
    return null;
  }
}