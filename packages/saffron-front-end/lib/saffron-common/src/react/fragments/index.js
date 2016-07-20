"use strict";
const React = require('react');
const index_1 = require('../../fragments/index');
class ReactComponentFactoryFragment extends index_1.FactoryFragment {
    constructor(ns, componentClass) {
        super(ns, {
            create(props, children) {
                return React.createElement(componentClass, props, children);
            }
        });
    }
}
exports.ReactComponentFactoryFragment = ReactComponentFactoryFragment;
//# sourceMappingURL=index.js.map