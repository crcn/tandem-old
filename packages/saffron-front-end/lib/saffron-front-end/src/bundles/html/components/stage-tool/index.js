"use strict";
require('./index.scss');
const React = require('react');
const index_1 = require('saffron-common/src/react/fragments/index');
const d = [];
const x2 = 0;
const y2 = 200;
const length = 100;
const rotation = 0;
class OriginToolComponent extends React.Component {
    render() {
        return (React.createElement("div", {className: 'm-origin-tool'}, 
            React.createElement("svg", {style: {
                left: x2,
                top: y2,
                transform: 'rotate(' + rotation + 'deg)',
                transformOrigin: 'top center',
            }, viewBox: [0, 0, 11, length], width: 11, height: length}, 
                React.createElement("path", {d: [
                    'M6 ' + length,
                    'L4 ' + (length - 5),
                    'M6 ' + length,
                    'L8 ' + (length - 5),
                ].join(''), stroke: '#FF00FF', fill: 'transparent'}), 
                React.createElement("path", {d: d.join(''), stroke: '#FF00FF', fill: 'transparent'}))
        ));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = OriginToolComponent;
exports.fragment = new index_1.ReactComponentFactoryFragment('components/tools/origin', OriginToolComponent);
//# sourceMappingURL=index.js.map