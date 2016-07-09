import './index.scss';

import React from 'react';
import RegisteredComponent from 'common/react/components/registered';
import StageToolsComponent from './tools';
import PreviewComponent from './preview';
import { MouseEvent, STAGE_PREVIEW_MOUSE_DOWN } from 'editor-fragment/events';

export default class StageComponent extends React.Component {
  render() {
    return <div className='m-editor-stage'>
      <PreviewComponent {...this.props} />
      <StageToolsComponent {...this.props} />
    </div>;
  };
}
