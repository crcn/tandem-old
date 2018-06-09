import * as React from "react";
import * as ReactDOM from "react-dom";
import { compose, pure, lifecycle } from "recompose";

type PortalOptions = {
  didMount?: (props) => (element: HTMLDivElement) => any;
};

export const portal = ({ didMount }: PortalOptions = {}) => Base => {
  return class Portal extends React.Component<{ style: any }, any> {
    private _mount: HTMLDivElement;

    componentDidMount() {
      const mount = (this._mount = document.createElement("div"));
      document.body.appendChild(mount);
      this.renderPortal();
      if (didMount) {
        didMount(this.props)(mount);
      }
    }
    componentWillUnmount() {
      ReactDOM.unmountComponentAtNode(this._mount);
      this._mount.remove();
    }
    componentDidUpdate() {
      this.renderPortal();
    }
    renderPortal() {
      ReactDOM.render(
        <div style={this.props.style}>{this.props.children}</div>,
        this._mount
      );
    }
    render() {
      return null;
    }
  };
};
