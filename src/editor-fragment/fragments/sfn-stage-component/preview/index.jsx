import './index.scss';

import React from 'react';
import RegisteredComponent from 'common/react/components/registered';
import { MouseEvent, STAGE_PREVIEW_MOUSE_DOWN } from 'editor-fragment/events';

export default class PreviewComponent extends React.Component {

  onMouseDown(event) {
    this.props.bus.execute(MouseEvent.create(STAGE_PREVIEW_MOUSE_DOWN, event));
  }

  render() {
    return <div className='m-editor-stage-preview' onMouseDown={this.onMouseDown.bind(this)}>
      <RegisteredComponent {...this.props} ns='components/preview' />
    </div>;
  };
}
