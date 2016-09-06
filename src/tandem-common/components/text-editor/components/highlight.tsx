import Marker from "../models/marker";
import * as React from "react";
import TextEditor from "../models/text-editor";

class HighlightComponent extends React.Component<{ editor: TextEditor, marker: Marker }, any> {
  render() {

    const editor = this.props.editor;
    const marker = this.props.marker;
    const p1     = this._calcPosition(editor.getCellFromPosition(marker.position));

    const p2 = this._calcPosition(editor.getCellFromPosition(marker.position + marker.length));

    const h = editor.textRuler.calculateLineHeight();
    const w = editor.calculateWidth();

    const highlights = [];

    // start
    highlights.push(
      this.renderHighlight(p1.left, p1.top, p2.top === p1.top ? p2.left - p1.left : w - p1.left, h)
    );

    // mid
    if (p2.top - h !== p1.top) {
      highlights.push(
        this.renderHighlight(0, p1.top + h, w, p2.top - p1.top - h)
      );
    }

    // end
    if (p1.top !== p2.top) {
      highlights.push(
        this.renderHighlight(0, p2.top, p2.left, h)
      );
    }

    return <div className="m-text-editor--highlights">
      { highlights }
    </div>;
  }

  _calcPosition(cell) {
    const editor = this.props.editor;
    const line = editor.lines[cell.row];
    return {
      top: editor.textRuler.calculateLineHeight() * line.index,
      left: editor.textRuler.calculateSize(line.toString().substr(0, cell.column))[0]
    };
  }

  renderHighlight(left, top, width, height) {

    const style = {
      transform: "translate(" + left + "px," + top + "px)",
      width    : width,
      height   : height
    };

    return <div style={style} className="m-text-editor--highlight" key={top}>

    </div>;
  }
}

export default HighlightComponent;
