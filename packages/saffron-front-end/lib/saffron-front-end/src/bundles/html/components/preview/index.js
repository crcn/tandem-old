"use strict";
const React = require('react');
const index_1 = require('saffron-common/src/react/fragments/index');
class PreviewComponent extends React.Component {
    componentDidMount() {
        this._update();
    }
    shouldComponentUpdate(props) {
        return this.props.entity !== props.entity;
    }
    componentWillUpdate() {
        this.props.entity.section.remove();
    }
    componentDidUpdate() {
        this._update();
    }
    _update() {
        this.refs.container.appendChild(this.props.entity.section.toFragment());
    }
    render() {
        return (React.createElement("div", {ref: 'container'}));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PreviewComponent;
exports.fragment = new index_1.ReactComponentFactoryFragment('components/preview', PreviewComponent);
//# sourceMappingURL=index.js.map