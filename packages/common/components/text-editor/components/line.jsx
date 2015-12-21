import React from 'react';
import TokenComponent from './token';

class LineComponent extends React.Component {

  onClick(event) {
    var line = this.props.line;

    var bounds = this.refs.line.getBoundingClientRect();

    var rx = event.clientX - bounds.left;

    this.props.editor.caret.setPosition(
      line.getPosition() + this.props.editor.textRuler.convertPointToCharacterPosition(line.toString(), rx)
    );
  }

  onDoubleClick(event) {

  }

  render() {
    var line = this.props.line;

    return <div ref='line' className='m-text-editor--line' onClick={this.onClick.bind(this)}
    onDoubleClick={this.onDoubleClick.bind(this)}>
      {
        line.tokens.map((token, i) => {
          return <TokenComponent
            editor={this.props.editor}
            tokenComponentFactory={this.props.tokenComponentFactory}
            token={token}
            line={line}
            key={token.toString() + ',' + i} />;
        })
      }
    </div>;
  }
}

export default LineComponent;
