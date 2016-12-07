import TextEditorLine from "../models/line";
import React =  require("react");
import TextEditor from "../models/text-editor";
import { Injector } from "@tandem/common";
import TokenComponent from "./token";

class LineComponent extends React.Component<{ injector: Injector, line: TextEditorLine, editor: TextEditor }, any> {

  render() {

    const line   = this.props.line;
    const editor = this.props.editor;
    const tr     = editor.textRuler;


    return <div ref="line" className="m-text-editor--line">
      {
        line.tokens.length ? line.tokens.map((token, i) => {
          return <TokenComponent
            editor={this.props.editor}
            injector={this.props.injector}
            token={token}
            line={line}
            key={token.type + i} />;
        }) : <span>&nbsp;</span>
      }
    </div>;
  }
}

export default LineComponent;
