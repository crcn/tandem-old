import React =  require("react");
import ReactDOM = require("react-dom");

export class FocusComponent extends React.Component<{ select?: boolean, focus?: boolean, children?: any }, any> {
  private _timeout: any;
  static defaultProps = {
    focus: true
  };
  componentDidMount() {
    if (this.props.focus !== false) this.focus();
  }

  componentWillReceiveProps(nextProps) {
    clearTimeout(this._timeout);
    if (nextProps.focus === true) {
      this.focus();
    } else if (nextProps.focus === false) {
      this.blur();
    }
  }
  focus() {
    // need to wait a bit before focusing on element, otherwise
    // this does not work
    this._timeout = setTimeout(() => {
      const ref = this.getRef() as HTMLInputElement;
      ref.focus();
      if (this.props.select) {
        ref.select();
      }
    }, 1);
  }
  blur() {
    this._timeout = setTimeout(() => {
      this.getRef().blur();
    }, 1);
  }
  getRef(): any {
    const node = ReactDOM.findDOMNode(this as any);
    return (node.nodeName === "INPUT" ? node : node.querySelector("input")) || node;
  }
  componentWillUnmount() {
    clearTimeout(this._timeout);
  }
  render() {
    return this.props.children;
  }
}
