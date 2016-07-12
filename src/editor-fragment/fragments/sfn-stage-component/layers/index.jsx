import './index.scss';
import React from 'react';

import { STAGE_CANVAS_MOUSE_DOWN } from 'editor-fragment/events';
import PreviewLayerComponent from './preview';
import ToolsLayerComponent from './tools';
import IsolateComponent  from 'common/react/components/isolate';

export default class EditorStageLayersComponent extends React.Component {

  onMouseDown(event) {
    this.props.app.bus.execute({
      ...event,
      type: {
        mousedown: STAGE_CANVAS_MOUSE_DOWN
      }[event.type]
    })
  }

  render() {
    return <div className='m-editor-stage-layers'>
      <IsolateComponent inheritCSS={true} className='m-editor-stage-layers--isolate-container'>
        <div className='m-editor-stage-canvas' onMouseDown={this.onMouseDown.bind(this)}>
          <PreviewLayerComponent {...this.props} />
          <ToolsLayerComponent {...this.props} />
        </div>
      </IsolateComponent>
    </div>
  }
}
