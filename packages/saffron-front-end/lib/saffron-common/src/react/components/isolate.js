"use strict";
const React = require('react');
const ReactDOM = require('react-dom');
const bubble_iframe_events_1 = require('../../utils/html/bubble-iframe-events');
class IsolateComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        if (this.props.inheritCSS) {
            const head = this.head;
            Array.prototype.forEach.call(document.getElementsByTagName('style'), function (style) {
                head.appendChild(style.cloneNode(true));
            });
        }
        this.body.appendChild(this._mountElement = document.createElement('div'));
        this._render();
        this._addListeners();
    }
    componentDidUpdate() {
        this._render();
    }
    get window() {
        return this.refs.container.contentWindow;
    }
    get head() {
        return this.window.document.head;
    }
    get body() {
        return this.window.document.body;
    }
    _render() {
        ReactDOM.render(React.createElement("span", null, this.props.children), this._mountElement);
    }
    _addListeners() {
        bubble_iframe_events_1.default(this.refs.container);
    }
    render() {
        return React.createElement("iframe", {ref: 'container', onWheel: this.props.onWheel, onScroll: this.props.onScroll, className: this.props.className});
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = IsolateComponent;
//# sourceMappingURL=isolate.js.map