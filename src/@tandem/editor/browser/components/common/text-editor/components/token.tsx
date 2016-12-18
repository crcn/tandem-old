import React =  require("react");
import { TextEditorToken } from "../models/token";
import TextEditorLine from "../models/line";
import TextEditor from "../models/text-editor";
import { Kernel } from "@tandem/common";
import { TokenComponentFactoryProvider } from "@tandem/editor/browser/providers";

class TokenComponent extends React.Component<{ token: TextEditorToken, editor: TextEditor, line: TextEditorLine, kernel: Kernel }, any> {

  render() {
    const { token, kernel } = this.props;

    const props: any = {};

    const tokenFactory = kernel && TokenComponentFactoryProvider.find(token.type, kernel);

    if (tokenFactory) {
      props.children = tokenFactory.create(this.props);
    }

    if (!props.children) {
      props.dangerouslySetInnerHTML = {
        __html: token.encodedValue
      };
    }

    return <span
      ref="token"
      className={"m-text-editor--token " + "m-text-editor--token-" + token.type }
      {...props}>
    </span>;
  }
}

export default TokenComponent;
