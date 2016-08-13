import * as React from 'react';
import * as cx from 'classnames';

class CaretComponent extends React.Component<any, any> {
  render() {

    var caret = this.props.caret;
    var editor = this.props.editor;
    var cell = caret.getCell();

    var tr     = this.props.editor.textRuler;
    var line   = this.props.editor.lines[cell.row];

    var [x] = tr.calculateCharacterSize(line.toString().substr(0, cell.column));
    var h = line.getHeight();
    var y = h * cell.row;

    var classNames = cx({
      'm-text-editor--caret': true,
      'blink': this.props.idle
    });

    var style = {

      // offset cursor width
      'transform': 'translate('+ Math.max(0, x - 1) + 'px, ' + y + 'px)',
      'height'   : line.getHeight(),
      'backgroundColor': editor.style.color || 'black',
      'borderColor': editor.style.color || 'black'
    };

    return <div className={ classNames } style={style}>

    </div>;
  }
}

export default CaretComponent;
