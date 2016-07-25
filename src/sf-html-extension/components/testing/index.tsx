 import { IApplication } from 'sf-core/application';
 import {RootReactComponentFragment} from 'sf-front-end/fragments';

 import * as React  from 'react';

 class HTMLDebuggingComponent extends React.Component<any, any> {
   render() {
     return <div>
     hello
     </div>;
   }
 }

export const fragment = new RootReactComponentFragment(HTMLDebuggingComponent);