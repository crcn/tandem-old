import React from 'react';
import TokenComponent from './token';

class LineComponent extends React.Component {
  render() {
    var line = this.props.line;
    return <div className='m-text-editor--line'>
      {
        line.tokens.map((token, i) => {
          return <TokenComponent editor={this.props.editor} token={token} key={Math.random()} />;
        })
      }
    </div>;
  }
}

export default LineComponent;
