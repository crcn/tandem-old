import './index.scss';

import React from 'react';
import RegisteredComponent from 'common/components/registered';

// TODO - tools should be selected depending on the entity type
class ToolsLayerComponent extends React.Component {
  render() {
    var selection = this.props.app.selection;
    var tool      = this.props.app.preview.currentTool;

    return <div style={this.props.style} className='m-tools-layer'>

      <RegisteredComponent
        {...this.props}
        selection={selection}
        query={'preview/toolComponents'} />

    </div>;
  }
}

export default ToolsLayerComponent;
