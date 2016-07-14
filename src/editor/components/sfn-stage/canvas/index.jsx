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
        mousedown: STAGE_CANVAS_MOUSE_DOWN,
      }[event.type],
    });
  }

  render() {
    var style = {
      cursor: this.props.app.currentTool.cursor,
    };

    return (<IsolateComponent inheritCSS className='m-editor-stage-isolate'>
      <div className='m-editor-stage-canvas' style={style} onMouseDown={this.onMouseDown.bind(this)}>
        <PreviewLayerComponent {...this.props} />
        <ToolsLayerComponent {...this.props} />
      </div>
    </IsolateComponent>);
  }
}
