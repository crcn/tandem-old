import React = require("react");
import ReactDOM = require("react-dom");

class HelloWorldComponent extends React.Component<{ message: string }, any> {
	render() {
		return <div className="hello-world-component">{ this.props.message }</div>;
	}
}

const mount = document.createElement("div");

document.body.appendChild(mount);

ReactDOM.render(<HelloWorldComponent message="Something" />, mount);
