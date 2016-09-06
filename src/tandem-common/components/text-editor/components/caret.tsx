import * as React from "react";
import * as cx from "classnames";
import TextEditor from "../models/text-editor";
import Caret from "../models/caret";

class CaretComponent extends React.Component<{ idle: boolean, caret: Caret, editor: TextEditor }, any> {
  render() {

    const caret = this.props.caret;
    const editor = this.props.editor;
    const cell = caret.getCell();

    const tr     = this.props.editor.textRuler;
    const line   = this.props.editor.lines[cell.row];

    const [x] = tr.calculateCharacterSize(line.toString().substr(0, cell.column));
    const h = line.height;
    const y = h * cell.row;

    const classNames = cx({
      "m-text-editor--caret": true,
      "blink": this.props.idle
    });

    const style = {

      // offset cursor width
      "transform": "translate(" + Math.max(0, x - 1) + "px, " + y + "px)",
      "height"   : line.height,
      "backgroundColor": editor.style.color || "black",
      "borderColor": editor.style.color || "black"
    };

    return <div className={ classNames } style={style}>

    </div>;
  }
}

export default CaretComponent;
