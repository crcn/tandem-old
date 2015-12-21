import React from 'react';

class TokenComponent extends React.Component {

  onDoubleClick(event) {
    console.log('set selection');
    // this.props.line.selectToken(this.props.token);
  }

  onClick(event) {
    var token = this.props.token;

    var bounds = this.refs.token.getBoundingClientRect();

    var rx = event.clientX - bounds.left;

    this.props.editor.caret.setPosition(
      token.getPosition() + this.props.editor.textRuler.convertPointToCharacterPosition(token.value, rx)
    );
  }

  render() {
    var token = this.props.token;
    return <div
      ref='token'
      className='m-text-editor--token'
      onDoubleClick={this.onDoubleClick.bind(this)}
      onClick={this.onClick.bind(this)}
      dangerouslySetInnerHTML={{
        __html: token.encodedValue
      }}>
    </div>
  }
}

export default TokenComponent;
