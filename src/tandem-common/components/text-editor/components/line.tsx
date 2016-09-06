import Line from "../models/line";
import * as React from "react";
import TextEditor from "../models/text-editor";
import TokenComponent from "./token";
import { Dependencies } from "tandem-common/dependencies";

class LineComponent extends React.Component<{ dependencies: Dependencies, line: Line, editor: TextEditor }, any> {

  render() {

    const line   = this.props.line;
    const editor = this.props.editor;
    const tr     = editor.textRuler;


    return <div ref="line" className="m-text-editor--line">
      {
        line.tokens.length ? line.tokens.map((token, i) => {
          return <TokenComponent
            editor={this.props.editor}
            dependencies={this.props.dependencies}
            token={token}
            line={line}
            key={token.toString() + "," + i} />;
        }) : <span>&nbsp;</span>
      }
    </div>;
  }
}

export default LineComponent;
