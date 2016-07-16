import './index.scss';
import React from 'react';

import { STAGE_CANVAS_MOUSE_DOWN } from 'editor/events';
import PreviewLayerComponent from './preview';
import ToolsLayerComponent from './tools';
import IsolateComponent  from 'common/react/components/isolate';
import debounce from 'lodash/function/debounce';

export default class EditorStageLayersComponent extends React.Component {

  onMouseDown(event) {
    this.props.app.bus.execute({
      ...event,
      type: {
        mousedown: STAGE_CANVAS_MOUSE_DOWN,
      }[event.type]
    });
  }

  componentWillUpdate(props) {
    if (this.props.zoom !== props.zoom) {
      requestAnimationFrame(this._center.bind(this, props.zoom, this.props.zoom));
    }
  }

  componentDidMount() {
    const isolateBody = this.refs.isolate.body;
    isolateBody.scrollTop = isolateBody.scrollHeight / 2;
    isolateBody.scrollLeft = isolateBody.scrollWidth / 2;
    this._mousePosition = { left: 0, top: 0 };
  }

  onMouseMove = (event) => {
    this._mousePosition = {
      left: event.pageX,
      top : event.pageY
    };
  }

  onWheel = (event) => {
    this.onMouseMove(event);
    if (event.metaKey) {
      event.preventDefault();
      this.props.bus.execute({ 
        type: 'zoom', 
        delta: event.deltaY / 1000
      });  
    }
  }

  onScroll = (event) => {
    if (!this._hideTools()) {
      this.forceUpdate();
    }
  }

  _hideTools() {
    var paused = !!this._toolsHidden;
    if (this._toolsHidden) clearTimeout(this._toolsHidden);
    this._toolsHidden = setTimeout(this._showTools, 100);
    return paused;    
  }

  _showTools = () => {
    this._toolsHidden = void 0;
    this.forceUpdate();
  }

  _center = (newZoom, oldZoom) => {

    const delta = newZoom - oldZoom;
    const mult  = delta + 1;

    function calcPrev(value) {
      return Math.round((value / newZoom) * oldZoom);
    }
    
    const isolateBody = this.refs.isolate.body;

    var newHeight  = isolateBody.scrollHeight;
    var prevHeight = calcPrev(newHeight);

    var newWidth  = isolateBody.scrollWidth;
    var prevWidth = calcPrev(newWidth);

    var changeLeft = (newHeight - prevHeight) / 2;
    var changeTop = (newWidth - prevWidth)   / 2;

    var scrollTop   = isolateBody.scrollTop + changeTop;
    var scrollLeft  = isolateBody.scrollLeft + changeLeft;

    isolateBody.scrollTop = scrollTop;
    isolateBody.scrollLeft = scrollLeft;
    this.forceUpdate();
  }

  render() {
    var app = this.props.app;

    var style = {
      cursor: app.currentTool.cursor
    };

    return (<IsolateComponent ref='isolate' onWheel={this.onWheel} onScroll={this.onScroll} inheritCSS className='m-editor-stage-isolate'>
      <div className='m-editor-stage-canvas' onMouseMove={this.onMouseMove} style={style} onMouseDown={this.onMouseDown.bind(this)}>
        <PreviewLayerComponent {...this.props} />
        { this._toolsHidden ? void 0 : <ToolsLayerComponent {...this.props} /> }
      </div>
    </IsolateComponent>);
  }
}
