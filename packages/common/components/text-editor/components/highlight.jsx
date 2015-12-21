import React from 'react';

class HighlightComponent extends React.Component {
  render() {

    var editor = this.props.editor;
    var marker = this.props.marker;
    var cell1  = editor.getCellFromPosition(marker.position);
    var cell2  = editor.getCellFromPosition(marker.position + marker.length);

    var n = cell2.row - cell1.row;

    var sline = editor.lines[0];

    var highlights = [
      this.renderHighlight(sline, cell1.column, sline.length - cell1.column)
    ];


    return <div className='m-text-editor--highlights'>
      { highlights }
    </div>;
  }

  renderHighlight(line, start, end) {
    var editor = this.props.editor;
    var lh     = editor.lines[0].getHeight();
    var x      = editor.textRuler.calculateSize(line.toString().substr(0, start))[0]
    var w      = editor.textRuler.calculateSize(line.toString().substr(start))[0]
    var y      = lh * editor.lines.indexOf(line);
    var style = {
      transform: 'translate(' + x + ',' + y + ')',
      height   : lh,
      width    : w
    };

    // console.log(line.toString().substr(start, line.toString().length), line.toString(), start)
    return <div style={style} className='m-text-editor--highlight' key={y}>

    </div>
  }
}

export default HighlightComponent;
