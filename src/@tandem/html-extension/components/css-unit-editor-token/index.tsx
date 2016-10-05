import * as React from "react";
import {
  TokenComponentFactoryDependency
} from "@tandem/editor/dependencies";

export class UnitEditorTokenComponent extends React.Component<any, any> {
  render() {
    return <span className="keyword">
      { this.props.token.value }
    </span>;
  }
}

export const cssUnitEditorTokenComponentFactoryDependency = new TokenComponentFactoryDependency("unit", UnitEditorTokenComponent);