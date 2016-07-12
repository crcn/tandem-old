import './index.scss';

import React from 'react';
import RegisteredComponent from 'common/react/components/registered';
import StageToolsComponent from './tools';
import PreviewComponent from './preview';
import { MouseEvent, STAGE_PREVIEW_MOUSE_DOWN } from 'editor-fragment/events';
import { ReactComponentFactoryFragment } from 'common/react/fragments';

export default class StageComponent extends React.Component {
  render() {
    var file = this.props.file;
    var entity = file.entity;
    return <div className='m-editor-stage noselect'>
      <PreviewComponent {...this.props} entity={entity} />
      <StageToolsComponent {...this.props} entity={entity} />
    </div>;
  };
}

export const fragment = ReactComponentFactoryFragment.create('components/stage/sfn', StageComponent);
