import React from 'react';

class SymbolComponent extends React.Component {
  render() {
    return <div>
      { this.props.entry.label }
    </div>
  }
}

export default SymbolComponent;
