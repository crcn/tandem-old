"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var recompose_1 = require("recompose");
exports.getDispatcher = recompose_1.getContext({
    dispatch: React.PropTypes.func
});
// export const withOverridableState = (overridableState: OverridableStateInfo) => (Base: React.ComponentClass<any> | React.StatelessComponent<any>) => {
//   return class extends React.Component {
//     component
//     render() {
//       const props = {...this.props};
//       for (const overridableStateKey in overridableState) {
//         const {initialValue, updaterName} = overridableState[overridableStateKey];
//         props[updaterName] = (value) => this.setState({
//           ...this.state,
//           [overridableStateKey]: value
//         });
//       }
//       return <Base {...props} />;
//     }
//   }
// } 
//# sourceMappingURL=index.js.map