import React from 'react';
import TokenComponent from './token';
import { translateAbsoluteToRelativePoint } from 'saffron-common/utils/html';

class LineComponent extends React.Component {

  render() {

    var line   = this.props.line;
    var editor = this.props.editor;
    var tr     = editor.textRuler;

    var style = {
      position: 'absolute',
      top     : tr.calculateLineHeight() * line.getIndex(),
      left    : 0,
      width   : '100%'
    };

    return <div ref='line' style={style} className='m-text-editor--line'>
      {
        line.tokens.length ? line.tokens.map((token, i) => {
          return <TokenComponent
            editor={this.props.editor}
            tokenComponentFactory={this.props.tokenComponentFactory}
            token={token}
            line={line}
            key={token.toString() + ',' + i} />;
        }) : <span>&nbsp;</span>
      }
    </div>;
  }
}

export default LineComponent;
