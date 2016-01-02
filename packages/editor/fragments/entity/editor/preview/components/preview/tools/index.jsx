import './index.scss';

import React from 'react';
import RegisteredComponent from 'common/components/registered';

// TODO - tools should be selected depending on the entity type
class ToolsLayerComponent extends React.Component {
  render() {
    var entity = this.props.app.focus;
    var tool   = this.props.app.preview.currentTool;

    return <div style={this.props.style} className='m-tools-layer'>

      <RegisteredComponent
        {...this.props}
        entity={entity}
        query={{
          componentType : 'tool',
          tool          : tool,
          entity        : entity
        }} />

    </div>;
  }
}

export default ToolsLayerComponent;
