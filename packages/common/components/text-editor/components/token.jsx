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
    var factory = this.props.tokenComponentFactory;

    var props = {};

    if (factory) {
      props.children = factory.create(this.props);
    }

    if (!props.children) {
      props.dangerouslySetInnerHTML = {
        __html: token.encodedValue
      };
    }

    return <div
      ref='token'
      className={'m-text-editor--token ' + 'm-text-editor--token-' + token.type }
      onDoubleClick={this.onDoubleClick.bind(this)}
      onClick={this.onClick.bind(this)}
      {...props}>
    </div>
  }
}

export default TokenComponent;
