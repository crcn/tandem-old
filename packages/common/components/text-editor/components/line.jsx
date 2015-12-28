import React from 'react';
import TokenComponent from './token';
import { translateAbsoluteToRelativePoint } from 'common/utils/html';

class LineComponent extends React.Component {

  onClick(event) {
    var line = this.props.line;

    var { left } = translateAbsoluteToRelativePoint(event, this.refs.line);

    this.props.editor.caret.setPosition(
      line.getPosition() + this.props.editor.textRuler.convertPointToCharacterPosition(line.toString(), left)
    );
  }

  render() {
    var line = this.props.line;

    return <div ref='line' className='m-text-editor--line' onMouseDown={this.onClick.bind(this)}>
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
