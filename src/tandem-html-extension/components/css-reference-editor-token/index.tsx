import * as React from "react";
import {
  TokenComponentFactoryDependency
} from "tandem-front-end/dependencies";

export class CSSReferenceEditorTokenComponent extends React.Component<any, any> {
  render() {
    return <span className="entity name instance">
      { this.props.token.value }
    </span>;
  }
}

export const cssReferenceEditorTokenComponentFactoryDependency = new TokenComponentFactoryDependency("reference", CSSReferenceEditorTokenComponent);