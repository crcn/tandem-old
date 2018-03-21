"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./scss/index.scss");
var reduceReducers = require("reduce-reducers");
var React = require("react");
var ReactDOM = require("react-dom");
var components_1 = require("./components");
var reducers_1 = require("./reducers");
var sagas_1 = require("./sagas");
var react_redux_1 = require("react-redux");
var middleware_1 = require("./middleware");
var aerial_common2_1 = require("aerial-common2");
var mainReducer = reduceReducers(reducers_1.applicationReducer);
exports.initApplication = function (initialState) {
    var store = aerial_common2_1.initBaseApplication2(initialState, mainReducer, sagas_1.mainSaga, middleware_1.createWorkerMiddleware());
    var render = function (Main) {
        ReactDOM.render(React.createElement(react_redux_1.Provider, { store: store },
            React.createElement(Main, { dispatch: function (action) { return store.dispatch(action); } })), initialState.element);
    };
    render(components_1.Main);
    // if (module["hot"]) {
    //   module["hot"].accept(() => {
    //     render(Main);
    //     debugger;
    //   });
    // }
};
//# sourceMappingURL=application.js.map