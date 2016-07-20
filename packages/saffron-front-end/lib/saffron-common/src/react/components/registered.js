"use strict";
const React = require('react');
class RegisteredComponent extends React.Component {
    render() {
        return (React.createElement("span", null, 
            " ", 
            this.props.app.fragments.queryAll(this.props.ns).map((fragment, key) => (fragment.create(Object.assign({}, this.props, { key: key, fragment: fragment })))), 
            " "));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RegisteredComponent;
//# sourceMappingURL=registered.js.map