import * as React from "react";
import { TextEditorToken } from "../models/token";
import TextEditorLine from "../models/line";
import TextEditor from "../models/text-editor";
import { Injector } from "@tandem/common";
import { TokenComponentFactoryProvider } from "@tandem/editor/browser/providers";

class TokenComponent extends React.Component<{ token: TextEditorToken, editor: TextEditor, line: TextEditorLine, injector: Injector }, any> {

  render() {
    const { token, injector } = this.props;

    const props: any = {};

    const tokenFactory = injector && TokenComponentFactoryProvider.find(token.type, injector);

    if (tokenFactory) {
      props.children = tokenFactory.create(this.props);
    }

    if (!props.children) {
      props.dangerouslySetInnerHTML = {
        __html: token.encodedValue
      };
    }

    return <div
      ref="token"
      className={"m-text-editor--token " + "m-text-editor--token-" + token.type }
      {...props}>
    </div>;
  }
}

export default TokenComponent;
