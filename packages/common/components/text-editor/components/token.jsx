import React from 'react';

class TokenComponent extends React.Component {


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
      {...props}>
    </div>
  }
}

export default TokenComponent;
