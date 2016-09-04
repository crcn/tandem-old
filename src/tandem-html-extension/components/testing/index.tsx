 import { IApplication } from 'tandem-common/application';
 import { RootReactComponentDependency } from 'tandem-front-end/dependencies';

 import * as React  from 'react';

 class HTMLDebuggingComponent extends React.Component<any, any> {
   render() {
     return <div>
     hello
     </div>;
   }
 }

export const dependency = new RootReactComponentDependency(HTMLDebuggingComponent);