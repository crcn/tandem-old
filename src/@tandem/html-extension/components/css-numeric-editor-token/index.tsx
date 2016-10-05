import * as React from "react";
import {
  TokenComponentFactoryDependency
} from "@tandem/editor/dependencies";

export class CSSNumericEditorTokenComponent extends React.Component<any, any> {
  render() {
    return <span className="constant numeric">
      { this.props.token.value }
    </span>;
  }
}

export const cssNumericEditorTokenComponentFactoryDependency = new TokenComponentFactoryDependency("number", CSSNumericEditorTokenComponent);