import * as React from "react";
import { TokenComponentFactoryDependency } from "tandem-front-end/dependencies";
import Token from "tandem-front-end/components/text-editor/models/token";

import { CSSTokenTypes } from "tandem-html-extension/tokenizers";

export class ColorTokenComponent extends React.Component<{ token: Token }, any> {
  render() {
    return <span className="constant other">
      { this.props.token.value }
    </span>;
  }
}

export const cssColorTokenComponentFactoryDependency = new TokenComponentFactoryDependency(CSSTokenTypes.COLOR, ColorTokenComponent);