import * as React from "react";
import { TokenComponentFactoryDependency } from "tandem-front-end/dependencies";
import Token from "tandem-front-end/components/text-editor/models/token";

import { CSSTokenTypes } from "tandem-html-extension/tokenizers";

export class ColorTokenComponent extends React.Component<{ token: Token }, any> {
  render() {
    return <span>
      <span style={{ color: this.props.token.value }}>#</span>
      { this.props.token.value.substr(1) }
    </span>;
  }
}

export const cssColorTokenComponentFactoryDependency = new TokenComponentFactoryDependency(CSSTokenTypes.COLOR, ColorTokenComponent);