import './stage.scss';

import React from 'react';
import ToolsLayerComponent from './tools';
import RegisteredComponent from 'common/components/registered';
import { PREVIEW_STAGE_CLICK } from 'editor/message-types';

class StageComponent extends React.Component {

  onClick(event) {

    var rect = this.refs.canvas.getBoundingClientRect();

    // this math seems very odd. However, rect.left property gets zoomed,
    // whereas the width stays the same. Need to offsets mouse x & y with this.

    var x = (event.clientX - rect.left * this.props.app.preview.zoom) / this.props.app.preview.zoom;
    var y = (event.clientY - rect.top * this.props.app.preview.zoom) / this.props.app.preview.zoom;

    this.props.app.preview.notify({
      ...event,
      type: PREVIEW_STAGE_CLICK,
      x: x,
      y: y
    });
  }

  componentDidMount() {

    // TODO: runloop here
    requestAnimationFrame(() => {
      var preview = this.props.app.preview;
      var stage   = this.refs.stage;

      while(preview.canvasWidth * preview.zoom > stage.offsetWidth) {
        preview.zoomOut();
      }
    });

    this.centerCanvas();
  }

  centerCanvas() {
    var inner    = this.refs.inner;
    var scroller = this.refs.scroller;
    inner.scrollTop  = scroller.offsetHeight / 2 - inner.offsetHeight / 2;
    inner.scrollLeft = scroller.offsetWidth / 2 - inner.offsetWidth / 2;
  }

  componentWillUnmount() {
    this.props.app.notifier.remove(this);
  }

  render() {

    var app = this.props.app;
    var preview = this.props.app.preview;
    var { zoom, canvasWidth, canvasHeight, currentTool } = preview;

    var canvasStyle = {

      // necessary to ensure that percentages work for
      // child elements - especially when converting units.
      position: 'relative',

      // TODO - this needs to be based off of room symbol
      width  : canvasWidth,
      height : canvasHeight,
      zoom   : zoom
    };

    var scrollStyle = {
      width  : canvasWidth * 2,
      height : canvasHeight * 2
    };

    var previewStyle = {
      cursor: currentTool ? currentTool.cursor : void 0
    };

    var entity = this.props.app.rootEntity;

    return <div ref='stage' className='m-preview-stage' style={previewStyle}>
      <div ref='inner' className='m-preview-stage--inner'>
        <div ref='scroller' className='m-preview-stage--scroll' style={scrollStyle}>

          <div className='m-preview-stage--center'>
            <div ref='canvas' className='m-preview-stage--canvas' style={canvasStyle}>

              <div id='preview-canvas'
                className='m-preview-stage--element-layer'
                role='preview stage'
                onClick={this.onClick.bind(this)}>
                <span ref='drawLayer' className='reset-all m-preview-stage--draw-layer'>
                  <RegisteredComponent {...this.props} entity={entity} queryOne={{
                    componentType: entity.componentType
                  }} />
                </span>
              </div>

            </div>

            <ToolsLayerComponent app={app} zoom={preview.zoom} />
          </div>

        </div>
      </div>
    </div>;
  }
}

export default StageComponent;
