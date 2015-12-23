import './index.scss';
import React from 'react';
import RulerComponent from './ruler'
import ResizerComponent from './resizer';
import TextToolComponent from './text';
import RegisteredComponent from 'common/components/registered';

// <ResizerComponent
//   app={this.props.app}
//   focus={this.props.app.focus}
//   zoom={this.props.zoom} />
//
// <RulerComponent
//   app={this.props.app}
//   focus={this.props.app.focus}
//   zoom={this.props.zoom} />
//
// <TextToolComponent
//   app={this.props.app}
//   entity={this.props.app.focus}
//   zoom={this.props.zoom} />

// TODO - tools should be selected depending on the entity type
class ToolsLayerComponent extends React.Component {
  render() {
    var entity = this.props.app.focus;
    var tool   = this.props.app.preview.currentTool;

    return <div className='m-tools-layer'>

        <RegisteredComponent
           {...this.props} query={{
            componentType: 'tool',
            toolType: tool.type,
            entity: entity
        }} />

    </div>;
  }
}

export default ToolsLayerComponent;
