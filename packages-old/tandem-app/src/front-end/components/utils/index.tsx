import * as React from "react";
import { getContext } from "recompose";

export const getDispatcher = getContext({
  dispatch: React.PropTypes.func
});

export type OverridableStateInfo = {
  [identifier: string]: {
    initialValue: any;
    updaterName: string;
  }
};

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