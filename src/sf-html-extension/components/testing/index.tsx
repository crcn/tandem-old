 import { IApplication } from 'sf-core/application';
 import {RootReactComponentDependency} from 'sf-front-end/dependencies';

 import * as React  from 'react';

 class HTMLDebuggingComponent extends React.Component<any, any> {
   render() {
     return <div>
     hello
     </div>;
   }
 }

export const fragment = new RootReactComponentDependency(HTMLDebuggingComponent);