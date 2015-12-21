import React from 'react';
import cx from 'classnames';

function getTextWidth(text, font) {
    // re-use canvas object for better performance
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
};

class MarkerComponent extends React.Component {
  componentDidMount() {

  }
  render() {

    var caret = this.props.caret;
    var cell = caret.getCell();

    var line   = this.props.editor.lines[cell.row];

    console.log(caret.position, cell);

    var div = document.createElement('span');
    div.innerHTML = line.toString().substr(0, cell.column).replace(/\s/g,'&nbsp;');
    document.body.appendChild(div);
    // console.log(div.offsetWidth);
    var x = div.offsetWidth;
    var h = div.offsetHeight;
    var y = div.offsetHeight * cell.row;
    var lh = 12;

    document.body.removeChild(div);

    var classNames = cx({
      'm-text-editor--caret': true,
      'blink': true
    });

    var style = {
      'transform': 'translate('+ Math.max(0, x - 1) + 'px, ' + (y + 2) + 'px)',
      'height'   : 20
    };

    // console.log(x, y);

    return <div className={ classNames } style={style}>

    </div>;
  }
}

export default CaretComponent;
